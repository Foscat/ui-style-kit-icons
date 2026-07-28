# Security

Please report security issues through GitHub Security Advisories:

https://github.com/Foscat/ui-style-kit-icons/security/advisories/new

The demo is a static GitHub Pages site. The runtime loads SVG files from this
package or from an explicitly configured asset base URL. Before rendering into
the custom-element shadow root, it removes executable elements, event-handler
attributes, embedded browsing or media elements, and non-local URL references.
Internal SVG references such as `url(#gradient)` and `href="#symbol"` remain
supported.
