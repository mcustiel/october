<?php
namespace Mariano\Video\Components;

use Cms\Classes\ComponentBase;

class Test extends ComponentBase
{
    public function componentDetails()
    {
        return [
            'name'        => 'Test component',
            'description' => 'Test assets in partials'
        ];
    }

    public function onRun()
    {
        $this->addJs('assets/js/onRun.js');
        $this->addCss('assets/css/onRun.css');
    }

    public function onRender()
    {
        $this->addJs('assets/js/onRender.js');
        $this->addCss('assets/css/onRender.css');
    }

    public function init()
    {
        $this->addJs('assets/js/init.js');
        $this->addCss('assets/css/init.css');
    }
}
