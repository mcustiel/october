<?php
namespace Mcustiel\CompactPages\Classes\Twig\TokenParsers;

use Twig_TokenParser;
use Twig_Token;
use Mcustiel\CompactPages\Classes\Twig\Nodes\InlineStyle as InlineStyleNode;

class InlineStyle extends Twig_TokenParser
{
    /**
     * Parses a token and returns a node.
     *
     * @param Twig_Token $token A Twig_Token instance
     *
     * @return Twig_NodeInterface A Twig_NodeInterface instance
     */
    public function parse(Twig_Token $token)
    {
        $stream = $this->parser->getStream();
        $stream->expect(Twig_Token::BLOCK_END_TYPE);
        return new InlineStyleNode($token->getLine(), $this->getTag());
    }

    /**
     * Gets the tag name associated with this token parser.
     *
     * @return string The tag name
     */
    public function getTag()
    {
        return 'inlineStyles';
    }
}