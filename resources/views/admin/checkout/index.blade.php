@extends('admin.layout')
@section('title','Thanh toán')
@section('content')
    @include('admin.checkout.checkout')
    @include('admin.checkout.js-fix')
    @include('admin.checkout.paypal')
@endsection




