<?php namespace Mariano\Video\Controllers;

use Backend\Facades\BackendMenu;
use Backend\Classes\Controller;

/**
 * Video Back-end Controller
 */
class Video extends Controller
{
    public $implement = [
        'Backend.Behaviors.FormController',
        'Backend.Behaviors.ListController'
    ];

    public $formConfig = 'config_form.yaml';
    public $listConfig = 'config_list.yaml';

    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('Mariano.Video', 'video', 'video');
    }
}
