<?php
namespace Mcustiel\CompactPages\Classes\Services\Implementation;

use Mcustiel\CompactPages\Classes\Services\HtmlCompactorInterface;

class BasicHtmlCompactor implements HtmlCompactorInterface
{
    /**
     *
     * {@inheritdoc}
     *
     * @see \Mcustiel\CompactPages\Classes\Services\HtmlCompactorInterface::compactHtml()
     */
    public function compactHtml($html)
    {
        return preg_replace('/\s+/', ' ', $html);
    }
}
