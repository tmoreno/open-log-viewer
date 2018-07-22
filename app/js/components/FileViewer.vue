<template>
	<v-container class="log-lines-container" :style="{height: height + 'px'}">
		<div class="log-lines" ref="logLines"></div>
	</v-container>
</template>

<style>
	.log-lines-container { 
		padding: 0px;
		margin: 0 auto;
		display: flex;
		overflow: auto;
	}

	div.log-lines {
		font-size: 15px;
		line-height: initial;
	}

	div.log-lines p {
		margin: 0;
	}

	div.log-lines pre {
		margin: 0;
		font-family: Consolas, monaco, 'Courier New', Courier, monospace;
	}

	.error, .fatal {
		color: #721c24;
		background-color: #f8d7da;
		border-color: #f5c6cb;
	}

	.warning {
		color: #856404;
		background-color: #fff3cd;
		border-color: #ffeeba;
	}

	.debug {
		color: #155724;
		background-color: #d4edda;
		border-color: #c3e6cb;
	}
</style>

<script>
	const Tail = require("../tail");

	export default {
		props: [
			'file'
		],
		data() {
			return {
				height: window.innerHeight - document.querySelector(".tabs__bar").offsetHeight
			}
		},
		mounted: function() {
			let tail = new Tail(this.file, 1000);
					
			tail.on('readLines', lines => {
				lines.forEach(line => {
					this.appendLine(line);
				});
			});
			
			tail.start();
		},
		methods: {
			appendLine(line) {
				let pre = document.createElement("pre");
				pre.innerHTML = line;
				
				let p = document.createElement("p");
				p.appendChild(pre);
				
				this.applyClassColor(p);
			
				this.$refs.logLines.appendChild(p);
			},
			applyClassColor(line) {
				if (line.textContent.includes("FATAL")) {
					line.classList.add("fatal");
				}
				else if (line.textContent.includes("ERROR")) {
					line.classList.add("error");
				}
				else if (line.textContent.includes("WARN")) {
					line.classList.add("warning");
				}
				else if (line.textContent.includes("DEBUG")) {
					line.classList.add("debug");
				}
			}
		}
	}
</script>