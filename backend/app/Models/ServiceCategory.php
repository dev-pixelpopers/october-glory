<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceCategory extends Model
{
    use Auditable;

    /** A category is either a service page or a package page on the site. */
    public const KIND_SERVICES = 'services';

    public const KIND_PACKAGES = 'packages';

    protected $fillable = ['name', 'description', 'slug', 'image', 'kind', 'sort_order'];

    protected function casts(): array
    {
        return ['sort_order' => 'integer'];
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class, 'category_id');
    }
}
