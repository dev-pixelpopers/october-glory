<?php

use App\Jobs\SendMonthlyLoyaltyStatements;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Monthly loyalty statement: 1st of every month at 00:00.
Schedule::job(new SendMonthlyLoyaltyStatements)->monthlyOn(1, '00:00');
