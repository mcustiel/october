<?php namespace Mariano\Video\Components;

class Vimeo extends AbstractVideoComponent
{

    public function componentDetails()
    {
        return [
            'name'        => 'Vimeo video component',
            'description' => 'Embeds a vimeo video in the page'
        ];
    }

    public function onRender()
    {
        parent::onRender();
        $this->video = preg_replace(
            '~https?://vimeo.com/(\d+)~',
            'https://player.vimeo.com/video/\\1',
            $this->property('video')
        );
    }
}