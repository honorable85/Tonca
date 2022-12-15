<?php
namespace App\Models;

use Clicalmani\Flesco\Models\Model;

class TestModel extends Model 
{
    protected $table = 'COMPTE';
    protected $primaryKey = 'id_compte';

    function __construct( $id = null )
    {
        parent::__construct( $id );
    }
}