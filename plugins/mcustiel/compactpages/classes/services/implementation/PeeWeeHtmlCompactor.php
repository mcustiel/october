<?php
namespace Mcustiel\CompactPages\Classes\Services\Implementation;

use Mcustiel\CompactPages\Classes\Services\HtmlCompactorInterface;
use PHPWee\HtmlMin\HtmlMin;

class PeeWeeHtmlCompactor implements HtmlCompactorInterface
{
    /**
     *
     * {@inheritdoc}
     *
     * @see \Mcustiel\CompactPages\Classes\Services\HtmlCompactorInterface::compactHtml()
     */
    public function compactHtml($html)
    {
        return HtmlMin::minify($html);
    }
}