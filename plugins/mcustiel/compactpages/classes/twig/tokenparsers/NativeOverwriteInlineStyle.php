<?php
namespace Mcustiel\CompactPages\Classes\Twig\TokenParsers;

class NativeOverwriteInlineStyle extends InlineStyle
{
    /**
     * Gets the tag name associated with this token parser.
     *
     * @return string The tag name
     */
    public function getTag()
    {
        return 'styles';
    }
}