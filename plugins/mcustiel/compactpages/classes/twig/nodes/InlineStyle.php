<?php
namespace Mcustiel\CompactPages\Classes\Twig\Nodes;

use Twig_Node;
use Twig_Compiler;

class InlineStyle extends Twig_Node
{
    public function __construct($lineno, $tag = 'inlineStyles')
    {
        parent::__construct([], [], $lineno, $tag);
    }

    /**
     * Compiles the node to PHP.
     *
     * @param Twig_Compiler $compiler A Twig_Compiler instance
     */
    public function compile(Twig_Compiler $compiler)
    {
        $compiler
            ->addDebugInfo($this)
            ->write("echo \$this->env->getExtension('McustielCompactPages')->inlineStyles();\n")
            ->write("echo \$this->env->getExtension('CMS')->displayBlock('inlineStyles');\n");
    }
}