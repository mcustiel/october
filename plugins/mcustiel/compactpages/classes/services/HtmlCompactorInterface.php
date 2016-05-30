<?php
namespace Mcustiel\CompactPages\Classes\Services;

interface HtmlCompactorInterface
{
    /**
     * Compresses the given HTML.
     *
     * @param string $html
     * @return string
     */
    public function compactHtml($html);
}
