
!function() {
	function draw(str, to) {
		var tmp, match, val
		, re = /(")(?:\\?.)*?"|(-?[\d.]+)|true|false|null|[[\]{},:]/g
		, node = document.createElement("div")
		, span = document.createElement("span")
		, comm = document.createElement("i")
		, path = []
		, cache = {
			"{": fragment("{", "}"),
			"[": fragment("[", "]"),
			",": fragment(","),
			":": document.createTextNode(": ")
		}

		function fragment(a, b) {
			var frag = document.createDocumentFragment()
			frag.appendChild(document.createTextNode(a))
			frag.appendChild(node.cloneNode())
			if (b) {
				frag.appendChild(document.createTextNode(b))
			}
			return frag
		}

		to.addEventListener("click", function(e) {
			var target = e.target
			if (target.tagName == "I") {
				target.classList.toggle("is-collpsed")
			}
		}, true)

		try {
			for (; match = re.exec(str); ) {
				val = match[0]
				if (val == "{" || val == "[") {
					path.push(node)
					node.appendChild(cache[val].cloneNode(true))
					node = node.lastChild.previousSibling
					node.len = 1
					node.start = re.lastIndex
				} else if (val == "}" || val == "]") {
					if (node.childNodes.length) {
						tmp = comm.cloneNode()
						tmp.dataset.content = node.len +
							(node.len == 1 ? " item, " : " items, ") +
							(re.lastIndex - node.start + 1) + " chars "
						node.parentNode.insertBefore(tmp, node)
					} else {
						node.parentNode.removeChild(node)
					}
					node = path.pop()
				} else if (val == ":") {
					node.appendChild(cache[val].cloneNode())
				} else if (val == ",") {
					node.len += 1
					node.appendChild(cache[val].cloneNode(true))
				} else {
					tmp = span.cloneNode()
					tmp.textContent = val
					tmp.className = match[1] ? "c2": "c1"
					node.appendChild(tmp)
				}
			}
			to.appendChild(node)
		} catch(e1) {
			to.className = "c3"
			try {
				JSON.parse(str)
				to.textContent = e1
			} catch (e2) {
				to.textContent = e2
			}
		}
	}

	var str, chr
	, body = document.body
	, first = body && body.firstChild
	if (first && first == body.lastChild && first.tagName == "PRE") {
		str = first.textContent
		chr = str.charAt(0)
		if (chr == "{" || chr == "[") {
			body.removeChild(first)
			var tag = document.createElement("link")
			tag.rel = "stylesheet"
			tag.href = chrome.extension.getURL("json.css")
			body.appendChild(tag)
			draw(str, body)
		}
	}
}()

