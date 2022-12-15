<?php
namespace App\Http\Controllers;

use Clicalmani\Flesco\Http\Controllers\RequestController;
use App\Http\Requests\TestRequest;
use App\Models\TestModel;
use Clicalmani\XPower\XDT;

class TestController extends RequestController
{
    function index(TestRequest $request, $name)
    {
        $request->createParametersHash([
            'name' => $name
        ]);
        return $request->redirect->route('/admin/' . $name . '/' . $request->hash);
    }

    function hash($request)
    {
        $xdt = new XDT;
        $model = new TestModel;
        echo '<pre>'; print_r($model->where('id_compte = 1')->get('privilege')); echo '</pre>';
        echo 'Hash: ' . $request->verifyParameters(); 
    }
}