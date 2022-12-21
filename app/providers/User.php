<?php
namespace App\Providers;

use Clicalmani\Flesco\Auth\UserAuth;
use Clicalmani\Flesco\Database\DB;

class User extends UserAuth
{
    function __construct( $user_id )
    {
        parent::__construct( $user_id );
    }

	/**
	 * (non-PHPdoc)
	 * @see ArrayAccess::offsetExists()
	 */
	function offsetExists($username){ 
		return DB::raw('SELECT userExists("' . $username . '", NULL)')->count();
	}
	 
	/**
	 * (non-PHPdoc)
	 * @see ArrayAccess::offsetGet()
	 */
	function offsetGet($username){ 
		$collection = DB::raw('SELECT userExists("' . $username . '", NULL)');

		if ($collection->count()) {
			return $collection->first();
		}

		return null;
	}
	 
	/**
	 * (non-PHPdoc)
	 * @see ArrayAccess::offsetSet()
	 */
	function offsetSet($username, $new_status){
		DB::raw('SELECT setUserStatus("' . $username . '", "' . $new_status . '")');
	}
	 
	/**
	 * (non-PHPdoc)
	 * @see ArrayAccess::offsetUnset()
	 */
	function offsetUnset($username){
		DB::raw('SELECT dropUser("' . $username . '")');
	}
}