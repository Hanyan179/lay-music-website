package com.hansen.fateEchoes.fate_echoes.service;

import com.hansen.fateEchoes.fate_echoes.entity.PersonalChoiceEvent;
import com.hansen.fateEchoes.fate_echoes.entity.ChoiceOption;

import java.util.List;
import java.util.Optional;

/**
 * 人生抉择服务接口
 */
public interface PersonalChoiceService {

    /**
     * 根据书籍代码获取起始事件
     * @param bookCode 书籍代码
     * @return 起始事件
     */
    Optional<PersonalChoiceEvent> getStartingEvent(String bookCode);

    /**
     * 根据书籍代码和事件代码获取事件
     * @param bookCode 书籍代码
     * @param eventCode 事件代码
     * @return 人生抉择事件
     */
    Optional<PersonalChoiceEvent> getEventByCode(String bookCode, String eventCode);

    /**
     * 获取事件的所有选项
     * @param eventId 事件ID
     * @return 选项列表
     */
    List<ChoiceOption> getEventOptions(Long eventId);

    /**
     * 根据选择历史判断当前应该发生的事件
     * @param bookCode 书籍代码
     * @param choiceHistory 选择历史（事件代码和选择的选项）
     * @return 当前应该发生的事件代码
     */
    Optional<String> getCurrentEventByHistory(String bookCode, List<String> choiceHistory);

    /**
     * 获取指定书籍的所有人生抉择事件
     * @param bookCode 书籍代码
     * @return 人生抉择事件列表
     */
    List<PersonalChoiceEvent> getAllChoiceEvents(String bookCode);

    /**
     * 根据选项确定下一个事件
     * @param option 选择的选项
     * @return 下一个事件代码（如果有的话）
     */
    Optional<String> getNextEventFromOption(ChoiceOption option);
}
