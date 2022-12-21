<?php
namespace App\Models;

use Clicalmani\Flesco\Models\Model;

class User extends Model
{
    protected $table = 'COMPTE uc';
    protected $primaryKey = 'id_compte';

    function __construct( $id = null )
    {
        parent::__construct( $id );
    }

    function group()
    {
        return $this->belongsTo(\App\Models\Group::class, 'uc.group_id');
    }

    function permission()
    {
        return $this->hasMany(\App\Models\Permission::class);
    }
}