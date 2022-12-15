<?php
namespace App\Http\Middleware;

use Clicalmani\Flesco\Http\Middleware\Middleware;

class Authenticate extends Middleware 
{
    function handler()
    {
        return routes_path( '/webauth.php' );
    }

    function authorize()
    {
        return true;
    }
}