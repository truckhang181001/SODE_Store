<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class shop_page extends Controller
{
    function index(){
        return view('shop_page.index');
    }
}
