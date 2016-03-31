<?php namespace Mariano\Video\Components;

class Youtube extends AbstractVideoComponent
{
    public function componentDetails()
    {
        return [
            'name'        => 'Youtube video component',
            'description' => 'Embeds a youtube video in the page'
        ];
    }

    public function init()
    {
        $this->addJs('https://www.youtube.com/iframe_api');
    }

    public function onRun()
    {
        parent::onRun();
        $this->video = $this->getVideoId($this->property('video'));
    }

    private function getVideoId($videoUrl)
    {
        $matches = [];
        $found = preg_match(
            '~^(?:https?://www\.youtube\.com/watch\?v=([^&]+).*|https?://youtu\.be/([^&?]+))$~',
            $videoUrl,
            $matches
        );
        if (!$found) {
            throw \Exception('Youtube video component: Configured video is not a youtube url');
        }
        return empty($matches[1]) ? $matches[2] : $matches[1];
    }
}
