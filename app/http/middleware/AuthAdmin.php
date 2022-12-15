<?php
namespace App\Http\Middleware;

use App\Http\Middleware\Authenticate;

class AuthAdmin extends Authenticate 
{
    function handler()
    {
        return routes_path( '/admin.php' );
    }

    function authorize()
    {
        return true;
    }
}