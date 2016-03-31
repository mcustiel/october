<?php namespace Mariano\Video;

use Backend;
use System\Classes\PluginBase;
use Mariano\Video\Components\File;
use Mariano\Video\Components\Youtube;
use Mariano\Video\Components\Vimeo;
use Mariano\Video\Components\Library;

/**
 * video Plugin Information File
 */
class Plugin extends PluginBase
{

    /**
     * Returns information about this plugin.
     *
     * @return array
     */
    public function pluginDetails()
    {
        return [
            'name'        => 'Video',
            'description' => 'Plugin to add videos to a page',
            'author'      => 'mariano',
            'icon'        => 'icon-video-camera'
        ];
    }

    /**
     * Registers any front-end components implemented in this plugin.
     *
     * @return array
     */
    public function registerComponents()
    {
        return [
            File::class => 'videoFile',
            Youtube::class => 'youtubeVideo',
            Vimeo::class => 'vimeoVideo',
            Library::class => 'libraryVideo',
        ];
    }

    /**
     * Registers any back-end permissions used by this plugin.
     *
     * @return array
     */
    public function registerPermissions()
    {
        return [
            'mariano.video.use' => [
                'tab' => 'video',
                'label' => 'Use the plugin'
            ],
        ];
    }

    /**
     * Registers back-end navigation items for this plugin.
     *
     * @return array
     */
    public function registerNavigation()
    {
        return [
            'video' => [
                'label'       => 'video',
                'url'         => Backend::url('mariano/video/video'),
                'icon'        => 'icon-video-camera',
                'permissions' => ['mariano.video.*'],
                'order'       => 500,
            ],
        ];
    }

}
