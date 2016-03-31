<?php namespace Mariano\Video\Components;

use Cms\Classes\ComponentBase;

abstract class AbstractVideoComponent extends ComponentBase
{
    public $video;
    public $width;
    public $height;

    public function defineProperties()
    {
        return [
            'video' => [
                'title'   => 'Video',
                'description'   => 'Video to attach to the page',
                'type'   => 'string',
                'validationPattern' => '^\S+$',
                'validationMessage' => 'Video can not be empty'
            ],
            'width' => [
                'title'   => 'Width',
                'description'   => 'Width of the video player',
                'type'   => 'string',
                'default' => 640,
                'validationPattern' => '^\d+$',
                'validationMessage' => 'Should be a number'
            ],
            'height' => [
                'title'   => 'Height',
                'description'   => 'Height of the video player',
                'type'   => 'string',
                'default' => 390,
                'validationPattern' => '^\d+$',
                'validationMessage' => 'Should be a number'
            ],
        ];
    }

    public function onRender()
    {
        $this->width = $this->property('width', 640);
        $this->height = $this->property('height', 390);
    }
}
