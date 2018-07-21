<template>
	<v-container fill-height>
		<div class="log-lines-container">
			<div id="log-lines" ref="logLines"></div>
		</div>
	</v-container>
</template>

<style>
	
</style>

<script>
	const Tail = require("../tail");

	export default {
		props: [
			'file'
		],
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