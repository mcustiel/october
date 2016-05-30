<?php namespace Mcustiel\CompactPages;

use App;
use Event;
use Config;
use System\Classes\PluginBase;
use System\Classes\MarkupManager;
use Mcustiel\CompactPages\Classes\Twig\TokenParsers\InlineStyle;
use Cms\Classes\Controller;
use Mcustiel\CompactPages\Classes\Twig\Extensions\InlineAssets;
use Mcustiel\CompactPages\Classes\Twig\TokenParsers\NativeOverwriteInlineStyle;
use Mcustiel\CompactPages\Classes\Twig\TokenParsers\InlineScript;
use Mcustiel\CompactPages\Classes\Twig\TokenParsers\NativeOverwriteInlineScripts;
use Mcustiel\CompactPages\Classes\Twig\TokenParsers\NativeOverwriteInlineScript;

/**
 * compactPages Plugin Information File
 */
class Plugin extends PluginBase
{
    public function boot()
    {
        Event::listen('cms.page.beforeDisplay', function (Controller $controller, $url, $page) {
            $controller->getTwig()->addExtension(App::make(InlineAssets::class));
        });

        if (Config::get('mcustiel.compactpages::compactation')) {
            Event::listen('cms.page.postprocess', function($controller, $url, $page, $dataHolder) {
                $compactor = App::make(
                    Config::get('mcustiel.compactpages::compactor')
                );
                $dataHolder->content = $compactor->compactHtml($dataHolder->content);
            });
        }
    }

    /**
     * Returns information about this plugin.
     *
     * @return array
     */
    public function pluginDetails()
    {
        return [
            'name'        => 'Compact Pages',
            'description' => 'Provides HTML compactation/minifaction and inline assets',
            'author'      => 'mcustiel',
            'icon'        => 'icon-cogs'
        ];
    }

    /**
     * Registers any front-end components implemented in this plugin.
     *
     * @return array
     */
    public function registerComponents()
    {
        return []; // Remove this line to activate

    }

    /**
     * Registers any back-end permissions used by this plugin.
     *
     * @return array
     */
    public function registerPermissions()
    {
        return []; // Remove this line to activate

    }

    /**
     * Registers back-end navigation items for this plugin.
     *
     * @return array
     */
    public function registerNavigation()
    {
        return []; // Remove this line to activate

    }

    public function registerMarkupTags()
    {
        $tokenParsers =  [
            MarkupManager::EXTENSION_TOKEN_PARSER => [
                App::make(InlineStyle::class),
                App::make(InlineScript::class),
            ]
        ];
        if (Config::get('mcustiel.compactpages::overwrite')) {
            $tokenParsers[MarkupManager::EXTENSION_TOKEN_PARSER][] = App::make(
                NativeOverwriteInlineStyle::class
            );
            $tokenParsers[MarkupManager::EXTENSION_TOKEN_PARSER][] = App::make(
                NativeOverwriteInlineScript::class
            );
        }
        return $tokenParsers;
    }

}
