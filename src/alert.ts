import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

interface GrowiNode extends Node {
  name: string;
  type: string;
  attributes: {[key: string]: string}
  children: GrowiNode[];
  value: string;
}

export const plugin: Plugin = function() {
  return (tree) => {
    visit(tree, (node) => {
      const n = node as unknown as GrowiNode;
      try {
        if (n.type === 'leafGrowiPluginDirective' && n.name === 'alert') {
          const type = Object.keys(n.attributes)[0];
          const { heading, text } = n.attributes;
          let headingContent = `<h4 class="alert-heading">${heading}</h4>`;
          if (heading === '') {
            headingContent = '';
          }
          n.type = 'html';
          n.value = `<div class="alert alert-${type}">
            ${headingContent}
              ${text}
          </div>
          `;
        }
      }
      catch (e) {
        n.type = 'html';
        n.value = `<div style="color: red;">Error: ${(e as Error).message}</div>`;
      }
    });
  };
};
