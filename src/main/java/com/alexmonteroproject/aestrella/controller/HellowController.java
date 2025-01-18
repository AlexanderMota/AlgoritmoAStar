package com.alexmonteroproject.aestrella.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.ui.Model;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HellowController {

    @GetMapping("/")
    public String helloWorld(Model model) {
    	
        /*List<Cell> cells = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            for (int j = 0; j < 15; j++) {
                cells.add(new Cell(i, j));
            }
        }
        model.addAttribute("cells", cells);*/
    	
        return "main"; // nombre del archivo HTML (main.html) en templates
    }
    /*public static class Cell {
        private int row;
        private int col;

        public Cell(int row, int col) {
            this.row = row;
            this.col = col;
        }

        public int getRow() {
            return row;
        }

        public int getCol() {
            return col;
        }
    }*/
    
    @GetMapping("/aestrella1")  // Esta URL será http://localhost:4500/aestrella/1
    public String getAestrella1() {
        return "aestrella1";  // Nombre del archivo HTML sin la extensión
    }

    @GetMapping("/aestrella2")  // Esta URL será http://localhost:4500/aestrella/2
    public String getAestrella2() {
        return "aestrella2";  // Nombre del archivo HTML sin la extensión
    }

    @GetMapping("/aestrella3")  // Esta URL será http://localhost:4500/aestrella/2
    public String getAestrella3() {
        return "aestrella3";  // Nombre del archivo HTML sin la extensión
    }

    @GetMapping("/aestrella4")  // Esta URL será http://localhost:4500/aestrella/2
    public String getAestrella4() {
        return "aestrella4";  // Nombre del archivo HTML sin la extensión
    }

    @GetMapping("/aestrella5")  // Esta URL será http://localhost:4500/aestrella/2
    public String getAestrella5() {
        return "aestrella5";  // Nombre del archivo HTML sin la extensión
    }
}