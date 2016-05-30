<?php
namespace Mcustiel\CompactPages\Classes\Twig\Extensions;

use Html;
use Twig_Extension;
use Backend\Classes\Controller;

class InlineAssets extends Twig_Extension
{
    /**
     * @var \Backend\Classes\Controller
     */
    private $controller;

    public function __construct(Controller $controller)
    {
        $this->controller = $controller;
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'McustielCompactPages';
    }

    /**
     * Gets all added styles and returns the code to inline it in the html.
     *
     * @return string
     */
    public function inlineStyles()
    {
        return '<style type="text/css">' . PHP_EOL
            . $this->assetsCode('css') . PHP_EOL
            . '</style>' .  PHP_EOL;
    }

    /**
     * Gets all added scripts and returns the code to inline it in the html.
     *
     * @return string
     */
    public function inlineScripts()
    {
        return '<script type="text/javascript">' . PHP_EOL
            . $this->assetsCode('js') . PHP_EOL
            . '</script>' .  PHP_EOL;
    }

    private function assetsCode($assetsType)
    {
        $html = '';
        foreach ($this->controller->getAssetPaths()[$assetsType] as $path) {
            $html .= file_get_contents(base_path(parse_url($path)['path']));
        }
        return $html;
    }
}
