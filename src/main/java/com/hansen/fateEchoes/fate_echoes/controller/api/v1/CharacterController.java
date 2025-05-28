package com.hansen.fateEchoes.fate_echoes.controller.api.v1;

import com.hansen.fateEchoes.fate_echoes.dto.character.CharacterDTO;
import com.hansen.fateEchoes.fate_echoes.vo.character.CharacterVO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/characters")
public class CharacterController {

    @PostMapping("/create")
    public ResponseEntity<?> createCharacter(@RequestBody CharacterDTO dto) {
        // 创建角色逻辑、




    return  null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<CharacterVO> getCharacter(@PathVariable Long id) {





        return  null;
    }
}
