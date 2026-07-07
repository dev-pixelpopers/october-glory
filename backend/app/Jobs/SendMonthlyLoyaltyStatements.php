<?php

namespace App\Jobs;

use App\Mail\MonthlyLoyaltyStatementMail;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

/**
 * Runs on the 1st of every month at 00:00 (see routes/console.php).
 * Emails every active user a summary of points earned/redeemed over
 * the trailing 30 days plus their ending balance.
 */
class SendMonthlyLoyaltyStatements implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        User::query()
            ->where('is_active', true)
            ->whereHas('loyaltyTransactions')
            ->with(['loyaltyTransactions' => fn ($q) => $q->where('created_at', '>=', now()->subDays(30))])
            ->chunkById(100, function ($users) {
                foreach ($users as $user) {
                    $earned = (int) $user->loyaltyTransactions->where('amount', '>', 0)->sum('amount');
                    $redeemed = (int) abs($user->loyaltyTransactions->where('amount', '<', 0)->sum('amount'));

                    Mail::to($user)->send(new MonthlyLoyaltyStatementMail(
                        user: $user,
                        earned: $earned,
                        redeemed: $redeemed,
                        balance: $user->loyaltyBalance(),
                    ));
                }
            });
    }
}
