<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class about_page extends Controller
{
    function index(){
        return view('user.about_page.index');
    }
}
