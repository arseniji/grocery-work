import React, { useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";

// Типы для пропсов
export interface ComboBoxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboBoxProps {
  options: ComboBoxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  width?: string;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  required?: boolean;
  name?: string;
}

// Стилизованные компоненты
const Container = styled.div<{ width?: string }>`
  width: ${({ width }) => width || "300px"};
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    sans-serif;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const RequiredStar = styled.span`
  color: #ff4d4f;
  margin-left: 4px;
`;

const ComboBoxWrapper = styled.div<{
  isOpen: boolean;
  disabled?: boolean;
  error?: boolean;
}>`
  position: relative;
  border: 1px solid ${({ error }) => (error ? "#ff4d4f" : "#d9d9d9")};
  border-radius: 6px;
  background-color: ${({ disabled }) => (disabled ? "#f5f5f5" : "white")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s;

  ${({ isOpen }) =>
    isOpen &&
    css`
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    `}

  &:hover {
    border-color: ${({ disabled, error }) =>
      disabled ? "#d9d9d9" : error ? "#ff4d4f" : "#40a9ff"};
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  min-height: 40px;
`;

const SelectedValue = styled.div<{ placeholder?: boolean }>`
  flex: 1;
  color: ${({ placeholder }) => (placeholder ? "#999" : "#333")};
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArrowIcon = styled.div<{ isOpen: boolean }>`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #666;
  transition: transform 0.3s;
  transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "rotate(0)")};
  margin-left: 8px;
`;

const Dropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08);
  z-index: 1000;
  max-height: 250px;
  overflow-y: auto;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transform: ${({ isOpen }) =>
    isOpen ? "translateY(0)" : "translateY(-10px)"};
  transition: all 0.3s;
`;

const Option = styled.div<{ isSelected: boolean; disabled?: boolean }>`
  padding: 8px 12px;
  font-size: 14px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  color: ${({ disabled, isSelected }) =>
    disabled ? "#999" : isSelected ? "#1890ff" : "#333"};
  background-color: ${({ isSelected }) =>
    isSelected ? "#e6f7ff" : "transparent"};
  display: flex;
  align-items: center;

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? "transparent" : "#f5f5f5"};
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `}
`;

const CheckIcon = styled.span`
  margin-right: 8px;
  color: #1890ff;
  font-size: 12px;
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #999;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  margin-left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  &:hover {
    color: #666;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-bottom: 1px solid #d9d9d9;
  font-size: 14px;
  outline: none;

  &:focus {
    border-bottom-color: #1890ff;
  }
`;

const NoOptions = styled.div`
  padding: 16px;
  text-align: center;
  color: #999;
  font-size: 14px;
`;

// Основной компонент ComboBox
export const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  width,
  error = false,
  errorMessage,
  label,
  required = false,
  name,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState<ComboBoxOption | null>(
    null
  );
  const comboBoxRef = useRef<HTMLDivElement>(null);

  // Фильтрация опций по поисковому запросу
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Инициализация выбранного значения
  useEffect(() => {
    if (value) {
      const foundOption = options.find((option) => option.value === value);
      setSelectedOption(foundOption || null);
    } else {
      setSelectedOption(null);
    }
  }, [value, options]);

  // Обработчик клика вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        comboBoxRef.current &&
        !comboBoxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Обработчик выбора опции
  const handleSelect = (option: ComboBoxOption) => {
    if (option.disabled) return;

    setSelectedOption(option);
    onChange?.(option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Обработчик очистки выбора
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOption(null);
    onChange?.("");
  };

  // Обработчик открытия/закрытия выпадающего списка
  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  // Обработчик ввода в поле поиска
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Обработчик нажатия клавиш
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
        if (isOpen && filteredOptions.length > 0) {
          handleSelect(filteredOptions[0]);
        } else {
          handleToggle();
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        break;
      case " ":
        e.preventDefault();
        handleToggle();
        break;
    }
  };

  return (
    <Container width={width} ref={comboBoxRef}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <RequiredStar>*</RequiredStar>}
        </Label>
      )}

      <ComboBoxWrapper
        isOpen={isOpen}
        disabled={disabled}
        error={error}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
      >
        <InputContainer>
          <SelectedValue placeholder={!selectedOption}>
            {selectedOption ? selectedOption.label : placeholder}
          </SelectedValue>

          {selectedOption && !disabled && (
            <ClearButton
              type="button"
              onClick={handleClear}
              aria-label="Clear selection"
              disabled={disabled}
            >
              ×
            </ClearButton>
          )}

          <ArrowIcon isOpen={isOpen} />
        </InputContainer>
      </ComboBoxWrapper>

      <Dropdown isOpen={isOpen}>
        <SearchInput
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          onClick={(e) => e.stopPropagation()}
          aria-label="Search options"
        />

        {filteredOptions.length === 0 ? (
          <NoOptions>No options found</NoOptions>
        ) : (
          filteredOptions.map((option) => (
            <Option
              key={option.value}
              isSelected={selectedOption?.value === option.value}
              disabled={option.disabled}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={selectedOption?.value === option.value}
              aria-disabled={option.disabled}
            >
              {selectedOption?.value === option.value && (
                <CheckIcon>✓</CheckIcon>
              )}
              {option.label}
            </Option>
          ))
        )}
      </Dropdown>

      {error && errorMessage && (
        <ErrorMessage role="alert">{errorMessage}</ErrorMessage>
      )}
    </Container>
  );
};
