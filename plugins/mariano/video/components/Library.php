<?php namespace Mariano\Video\Components;

use Cms\Classes\MediaLibrary;
use Cms\Classes\MediaLibraryItem;

class Library extends AbstractVideoComponent
{
    public $poster;

    public function componentDetails()
    {
        return [
            'name'        => 'Library video component',
            'description' => 'Embeds a video in the page from the media library'
        ];
    }

    public function defineProperties()
    {
        $properties = parent::defineProperties();
        $properties['video']['type'] = 'dropdown';
        $properties['poster'] = [
            'title'   => 'Poster',
            'description'   => 'Poster image',
            'type'   => 'dropdown',
        ];
        return $properties;
    }

    public function getVideoOptions()
    {
        return $this->getFilesPathByType(MediaLibraryItem::FILE_TYPE_VIDEO);
    }

    public function getPosterOptions()
    {
        return $this->getFilesPathByType(MediaLibraryItem::FILE_TYPE_IMAGE);
    }

    private function getFilesPathByType($type)
    {
        $mediaItems = MediaLibrary::instance()->findFiles('', 'title', $type);

        $return = [];
        foreach ($mediaItems as $mediaItem) {
            $return[$mediaItem->publicUrl] = $mediaItem->path;
        }

        return $return;
    }

    public function init()
    {
        parent::init();
        $this->addJs('assets/js/libs/ggsVideoPlayer.js');
    }

    public function onRender()
    {
        $this->width = $this->property('width', 640);
        $this->height = $this->property('height', 390);
        $this->video = $this->property('video');
        $this->poster = $this->property('poster');
    }
}
