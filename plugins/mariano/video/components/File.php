<?php namespace Mariano\Video\Components;

use Mariano\Video\Models\Video;

class File extends AbstractVideoComponent
{
    public function componentDetails()
    {
        return [
            'name'        => 'Video file component',
            'description' => 'Embeds a video in the page from an uploaded file'
        ];
    }

    public function defineProperties()
    {
        $properties = parent::defineProperties();
        $properties['video']['type'] = 'dropdown';
        return $properties;
    }

    public function getVideoOptions()
    {
        return Video::select('id', 'name')->orderBy('name')->get()->lists('name', 'id');
    }

    public function onRun()
    {
        parent::onRun();
        $video = (new Video())->where('id', '=', $this->property('video'))->first();
        $this->video = $video->video->path;
    }

}
