package com.hansen.fateEchoes.fate_echoes.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FateEchoesController { // 修正拼写错误 Controler → Controller

    @GetMapping(value = {"/", "/home"})
    public String home() {
        // 重定向到前端路由路径
        return "redirect:/character-creation";
    }
}
