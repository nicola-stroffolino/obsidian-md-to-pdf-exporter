import { fstat, readFileSync, writeFileSync, promises as fsPromises  } from 'fs';
import { App, Editor, MarkdownView, Modal, normalizePath, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { dirname, join } from 'path';
import { exec } from "child_process";

export default class MyPlugin extends Plugin {
	
	async onload() {
		
		const ribbonIconEl = this.addRibbonIcon('dice', 'PROVA', async (evt: MouseEvent) => {

			const preamble = [
				"\\usepackage{tikz}",
				"\\usetikzlibrary{calc,patterns,positioning,matrix,plotmarks,trees,shapes,decorations}",
				"\\usepackage{color,soul,soulutf8}"
			]

			const running = this.app

			const { basePath } = (running.vault.adapter as any); // const { peppe } = ciao.arrivederci ---> const peppe = ciao.arrivederci.peppe

			const dummy_partialPath = ".obsidian/plugins/obsidian-md-to-pdf-exporter/files/dummy.md"
			const template_partialPath = ".obsidian/plugins/obsidian-md-to-pdf-exporter/templates/eisvogel"

			
			/* Read Active File */

			let activeFile = running.workspace.getActiveFile(); // useful to get some file information with like .path
			if (!activeFile) return console.log("No file currently open.");

			let text = (await running.vault.read(activeFile)).split('\n');

			new Notice(`Exporting to PDF...`);

			/* Write into Dummy file */
			const outputFilePath_complete = join(basePath, dummy_partialPath);
			
			await this.resetFile(outputFilePath_complete);
			await this.writeFile(outputFilePath_complete, await this.headerize(preamble));
			
			let anInteger = 0;
			let i = 0;
			while(text[i].trim().length === 0) i++
			if(text[i].trimStart().trimEnd() == '---')
				text[i] = '';
			else
				text[i] = '---\n\n'+ text[i];
			for (let found = false; i < text.length; i++) {
				if (text[i].contains('`')) {
					if (text[i].contains('tikz render')) {
						let tmp = text[i].split(' ').last();
						text[i] = '\\begin{center}\\begin{tikzpicture}'

						if (tmp.startsWith('scale=')) text[i] += `[${tmp}, transform shape]`
						
						found = true
					} else if (found && text[i].trimStart().trimEnd() == '```') {
						text[i] = '\\end{tikzpicture}\\end{center}'
						found = false
					}
				} else if (!found) {
					text[i] = text[i].replace('<-->','$\\longleftrightarrow$');
					text[i] = text[i].replace('<->','$\\leftrightarrow$');

					text[i] = text[i].replace('--->','$\\longrightarrow$');
					text[i] = text[i].replace('-->','$\\longrightarrow$');
					text[i] = text[i].replace('->','$\\rightarrow$');

					text[i] = text[i].replace('<---','$\\longleftarrow$');
					text[i] = text[i].replace('<--','$\\longleftarrow$');
					text[i] = text[i].replace('<-','$\\leftarrow$');
					
					
					
					// text[i] = this.localize(text[i],'=','=' ,'\\hl{', '}',2);
					// text[i] = text[i].replace('==', '\\hl{');
					// text[i] = text[i].replace('==', '}');
					/*
					while contains(=) == true { 
						contains \== or contains =\= 
						continue
						else
						metti i \hl{ e }
					}
					*/
					let index = text[i].search("=");
					if (index != -1) {
						if (text[i][index] == '\\' || text[i][index + 1] == '\\') {
							console.log(`Trovato un figlio di puttana alla riga ${i} colonna ${index}`);
						}

						
					}

					text[i] += '\n'
				}
				
				await this.writeFile(outputFilePath_complete, text[i] + '\n');
			}
			

			/* Output Written File */
			const contents = readFileSync(outputFilePath_complete, {encoding:'utf8', flag:'r'});
			console.log(contents);
			

			/* Execute Pandoc Command */
			let command = ["pandoc", `"${outputFilePath_complete}"`, "-f", "markdown", "-t", "pdf", "-o", `"${basePath}/${activeFile.parent.path}${activeFile.basename}.pdf"`, "--template", `"${join(basePath, template_partialPath)}"`];
			
			exec(command.join(" "), (error: any, stdout: any, stderr: any) => {
				if (error) {
					console.log(`error: ${error.message}`);
					new Notice(`Error: ${error.message}`);
					return;
				}
				if (stderr) {
					console.log(`stderr: ${stderr}`);
					new Notice(`stderr: ${stderr}`);
					return;
				}
				console.log(`stdout: ${stdout}`);
				new Notice('Succesfully exported to PDF.');
			});
		});
	}

	onunload() {

	}

	localize(str :string, char : string, char1 :string, start :string, end : string, charNum : number) :string{
		let chars = [...str];
		let call = false;

		for(let r = 0, pass = 0, oldpass = 0; r < chars.length -1; r++){
			if((chars[r] == '\\' && (chars[r+1] == char || chars[r+1] == char1 ))){
				if(oldpass != 1)
					pass = 1;
				chars[r] = '';
				// alert(chars);
				r++;
			}
			else if (charNum == 2){
				if((chars[r] == char && chars[r+1] == char) || (chars[r] == char1 && chars[r+1] == char1)){
					oldpass = pass;

					if (pass == 1){
						pass = 0;
					}else{
						call = true;
						chars[r] = start;
						chars[++r] = '';
						r++;
						for(; r < chars.length -1; r++){
							if((chars[r] == char && chars[r+1] == char) || (chars[r] == char1 && chars[r+1] == char1)){
								chars[r] = end;
								chars[r+1] = '';
								break;
							}
						}
					}
				}
			}else if(charNum == 1){
				if(chars[r] == char){
					oldpass = pass;

					if (pass == 1){
						pass = 0;
					}else{
						call = true;
						chars[r] = start;
						// chars[++r] = ' ';
						r++;
						for(; r < chars.length -1; r++){
							if(chars[r] == char){
								chars[r] = end;
								// chars[r+1] = ' ';
								break;
							}
						}
					}
				}
			}
		}
		
		let ret = chars.join('');

		if(char === '=' && call){
			ret = this.localize(this.localize(ret, '*','_', '\\textbf{','}',2), '*','_', '\\textit{','}',1);
		}
		
		return ret
	}
	
	async writeFile(outputDir: string, data: any) {
		try {
			await fsPromises.writeFile(outputDir, data, {flag: 'a+'});
		  	
			return;
		} catch (err) { return console.log(err) }
	}

	async resetFile(outputDir: string) {
		try {
			await fsPromises.truncate(outputDir, 0);
		  	
			return;
		} catch (err) { return console.log(err) }
	}

	async headerize(packageArr: string[]) {
		let header = "---\nheader-includes:\n"

		for(let i = 0; i < packageArr.length; i++) {
			header += "- " + packageArr[i] + "\n"
		}

		return header
	}
}
