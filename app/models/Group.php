<?php
namespace App\Models;

use Clicalmani\Flesco\Models\Model;

class Group extends Model
{
    protected $table = 'user_group ug';
    protected $primaryKey = 'ug.ID';

    function __construct( $id = null )
    {
        parent::__construct( $id );
    }

    function permissions()
    {
        return $this->hasMany(\App\Models\Permission::class, 'group_id');
    }
}