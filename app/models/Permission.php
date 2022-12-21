<?php
namespace App\Models;

use Clicalmani\Flesco\Models\Model;

class Permission extends Model
{
    protected $table = 'user_permission up';
    protected $primaryKey = 'up.ID';

    function __construct( $id = null )
    {
        parent::__construct( $id );
    }

    function access()
    {
        return $this->belongsTo(\App\Models\Access::class);
    }
}