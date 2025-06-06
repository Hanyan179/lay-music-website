package com.fateechoes.entity;


import lombok.Data;

import javax.persistence.*;
import java.util.List;

/**
 * 事件实体类
 */
@Data
@Entity
@Table(name = "events")
public class Event {

    /**
     * 事件唯一ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 事件名称（唯一约束）
     */
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    /**
     * 图片存储路径
     */
    @Column(name = "image", nullable = false)
    private String image;


    /**、
     * 书籍代码
     */
     @Column(name = "book_id", nullable = false)
     private Long bookId;

    /**
     * 事件描述/问题
     */
    @Column(name = "question", nullable = false, columnDefinition = "TEXT")
    private String question;


    /**
     *
     */
     @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * 事件发生年份
     */
    @Column(name = "year", nullable = false)
    private Integer year;

    /**
     * 是否为起始事件
     */
    @Column(name = "is_entry", nullable = false)
    private Boolean isEntry = false;

    /**
     * 关联的选项列表
     */
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Option> options;
}
