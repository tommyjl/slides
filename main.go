package main

import (
	"bytes"
	"flag"
	"fmt"
	"html/template"
	"net/http"
	"os"
)

func main() {
	var port int
	inputFile := "sections.html"

	flag.IntVar(&port, "port", 8000, "server will listen on this port")
	flag.Parse()
	if flag.NArg() > 0 {
		inputFile = flag.Arg(0)
	}

	http.HandleFunc("GET /{$}", func(w http.ResponseWriter, r *http.Request) {
		main, err := os.ReadFile(inputFile)
		if err != nil {
			fmt.Println("error reading input file")
			w.WriteHeader(400)
			return
		}

		var b bytes.Buffer

		templ, err := template.ParseFiles("index.html")
		if err != nil {
			fmt.Println("error parsing template")
			w.WriteHeader(500)
			return
		}

		err = templ.Execute(&b, struct{ Main template.HTML }{Main: template.HTML(main)})
		if err != nil {
			fmt.Println("error executing template")
			w.WriteHeader(500)
			return
		}

		b.WriteTo(w)
	})

	http.HandleFunc("GET /style.css", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "style.css")
	})

	http.HandleFunc("GET /main.js", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "main.js")
	})

	fmt.Println("Listening on port", port)
	http.ListenAndServe(fmt.Sprintf("127.0.0.1:%d", port), nil)
}
