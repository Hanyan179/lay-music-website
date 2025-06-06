package com.hansen.fateEchoes.fate_echoes.service.impl;

import com.hansen.fateEchoes.fate_echoes.entity.PersonalChoiceEvent;
import com.hansen.fateEchoes.fate_echoes.entity.ChoiceOption;
import com.hansen.fateEchoes.fate_echoes.repository.PersonalChoiceEventRepository;
import com.hansen.fateEchoes.fate_echoes.repository.ChoiceOptionRepository;
import com.hansen.fateEchoes.fate_echoes.service.PersonalChoiceService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 人生抉择服务实现类
 */
@Slf4j
@Service
public class PersonalChoiceServiceImpl implements PersonalChoiceService {

    @Autowired
    private PersonalChoiceEventRepository personalChoiceEventRepository;

    @Autowired
    private ChoiceOptionRepository choiceOptionRepository;

    @Override
    public Optional<PersonalChoiceEvent> getStartingEvent(Long bookId) {
        log.debug("获取书籍 {} 的起始事件", bookId);
        return personalChoiceEventRepository.findByBookIdAndIsStartingEventTrue(bookId);
    }

    @Override
    public Optional<PersonalChoiceEvent> getEventByCode(Long bookId, String eventCode) {
        log.debug("获取书籍 {} 的事件代码 {} 对应的事件", bookId, eventCode);
        return personalChoiceEventRepository.findByBookIdAndEventCode(bookId, eventCode);
    }

    @Override
    public List<ChoiceOption> getEventOptions(Long eventId) {
        log.debug("获取事件 {} 的所有选项", eventId);
        return choiceOptionRepository.findByChoiceEventIdOrderBySortOrderAsc(eventId);
    }

    @Override
    public Optional<String> getCurrentEventByHistory(Long bookId, List<String> choiceHistory) {
        log.debug("根据选择历史获取当前事件：书籍 {}，历史 {}", bookId, choiceHistory);

        if (choiceHistory == null || choiceHistory.isEmpty()) {
            // 没有选择历史，返回起始事件
            Optional<PersonalChoiceEvent> startingEvent = getStartingEvent(bookId);
            return startingEvent.map(PersonalChoiceEvent::getEventCode);
        }

        // 根据最后的选择历史确定当前事件
        String lastChoice = choiceHistory.get(choiceHistory.size() - 1);

        // 解析选择历史格式：eventCode:optionIndex 或者直接是nextEventCode
        if (lastChoice.contains(":")) {
            String[] parts = lastChoice.split(":");
            if (parts.length >= 2) {
                String eventCode = parts[0];
                try {
                    int optionIndex = Integer.parseInt(parts[1]);

                    // 获取事件和选项
                    Optional<PersonalChoiceEvent> event = getEventByCode(bookId, eventCode);
                    if (event.isPresent()) {
                        List<ChoiceOption> options = getEventOptions(event.get().getId());
                        if (optionIndex >= 0 && optionIndex < options.size()) {
                            ChoiceOption selectedOption = options.get(optionIndex);

                            // 根据选项的操作类型确定下一步
                            if (selectedOption.getActionType() == ChoiceOption.ActionType.JUMP_TO_NEXT) {
                                if (selectedOption.getNextEventCode() != null && !selectedOption.getNextEventCode().trim().isEmpty()) {
                                    return Optional.of(selectedOption.getNextEventCode());
                                }
                            }
                        }
                    }
                } catch (NumberFormatException e) {
                    log.warn("解析选项索引失败: {}", parts[1]);
                }
            }
        } else {
            // 直接是事件代码
            return Optional.of(lastChoice);
        }

        return Optional.empty();
    }

    @Override
    public List<PersonalChoiceEvent> getAllChoiceEvents(Long bookId) {
        log.debug("获取书籍 {} 的所有人生抉择事件", bookId);
        return personalChoiceEventRepository.findByBookIdOrderByYearAscDisplayOrderAsc(bookId);
    }

    @Override
    public Optional<String> getNextEventFromOption(ChoiceOption option) {
        if (option == null) {
            return Optional.empty();
        }

        log.debug("获取选项 {} 的下一个事件", option.getId());

        if (option.getActionType() == ChoiceOption.ActionType.JUMP_TO_NEXT) {
            if (option.getNextEventCode() != null && !option.getNextEventCode().trim().isEmpty()) {
                return Optional.of(option.getNextEventCode());
            }
        }

        return Optional.empty();
    }
}
