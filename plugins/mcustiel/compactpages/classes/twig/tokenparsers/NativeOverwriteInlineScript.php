<?php
namespace Mcustiel\CompactPages\Classes\Twig\TokenParsers;

class NativeOverwriteInlineScript extends InlineScript
{
    /**
     * Gets the tag name associated with this token parser.
     *
     * @return string The tag name
     */
    public function getTag()
    {
        return 'scripts';
    }
}