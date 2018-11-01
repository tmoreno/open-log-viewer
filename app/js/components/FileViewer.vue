<template>
	<div>
		<div ref="logLinesScroll" class="clusterize-scroll" :style="{'max-height': height + 'px'}">
			<div ref="logLinesContent" class="clusterize-content"></div>
		</div>

		<v-dialog v-model="showDialog" max-width="500">
      		<v-card>
        		<v-card-title class="title error">
					Atención
				</v-card-title>

				<v-card-text class="font-weight-medium subheading">
					El archivo "{{file}}" no existe
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn color="primary" flat @click="showDialog = false">
						OK
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<style>
	.clusterize-content {
		font-size: 15px;
		line-height: initial;
		display: inline-block;
	}

	.clusterize-content p {
		margin: 0;
		white-space: pre;
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
	const Clusterize = require("clusterize.js");

	let tail;

	export default {
		props: [
			'file'
		],
		data() {
			return {
				height: this.calcHeight(),
				showDialog: false
			}
		},
		mounted: function() {
			let clusterize = new Clusterize({
				scrollElem: this.$refs.logLinesScroll,
				contentElem: this.$refs.logLinesContent
			});

			window.addEventListener('resize', this.handleResize);

			tail = new Tail(this.file, 1000);
					
			tail.on('readLines', lines => {
				let logLines = lines.map(line => {
					return this.createLogLine(line);
				});

				clusterize.append(logLines);
			});
			
			tail.start().catch(error => this.showDialog = true);
		},
		beforeDestroy: function() {
			tail.stop();

			window.removeEventListener('resize', this.handleResize);
		},
		methods: {
			createLogLine(line) {
				let p = document.createElement("p");
				p.innerHTML = line;
				
				this.applyClassColor(p);

				let temp = document.createElement("div");
				temp.appendChild(p);

				return temp.innerHTML;
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
			},
			handleResize() {
				this.height = this.calcHeight();
			},
			calcHeight() {
				return window.innerHeight - document.querySelector(".v-tabs__bar").offsetHeight;
			}
		}
	}
</script>