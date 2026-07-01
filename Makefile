SHELL := /bin/bash

.PHONY: help serve

help:
	@echo "paulorobertouri.github.io"
	@echo ""
	@echo "Static HTML/CSS portfolio site — no build step required."
	@echo ""
	@echo "  Open index.html in a browser, or run a local server:"
	@echo "    python3 -m http.server 8080"
	@echo "  Or use the convenience target:"
	@echo "    make serve"

serve:
	@python3 -m http.server 8080
