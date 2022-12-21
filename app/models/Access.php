<?php
namespace App\Models;

use Clicalmani\Flesco\Models\Model;

class Access extends Model
{
    protected $table = 'app_access ac';
    protected $primaryKey = 'ac.ID';

    function __construct( $id = null )
    {
        parent::__construct( $id );
    }

    function permission()
    {
        return $this->hasOne(\App\Models\Permission::class);
    }
}