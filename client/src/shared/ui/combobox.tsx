import React, { useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";
import { BaseBodyM } from "./captions";

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
  name?: string;
  onBlur?: () => void;
}

const Container = styled.div<{ width?: string }>`
  width: ${({ width }) => width || "300px"};
  position: relative;
`;

const ComboBoxWrapper = styled.div<{
  isOpen: boolean;
  disabled?: boolean;
  error?: boolean;
}>`
  position: relative;
  border: 1px solid ${({ error }) => (error ? "#ff4d4f" : "#000")};
  border-radius: 6px;
  background-color: ${({ disabled }) => (disabled ? "#f5f5f5" : "white")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s;

  ${({ isOpen }) =>
    isOpen &&
    css`
      border-color: #517907;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    `}

  &:hover {
    border-color: ${({ disabled, error }) =>
      disabled ? "#d9d9d9" : error ? "#ff4d4f" : "#517907"};
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
  ${BaseBodyM}
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
  ${BaseBodyM}
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  color: ${({ disabled, isSelected }) =>
    disabled ? "#999" : isSelected ? "#517907" : "#333"};
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
  color: #517907;
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

const NoOptions = styled.div`
  padding: 16px;
  text-align: center;
  color: #999;
  font-size: 14px;
`;

export const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  width,
  error = false,
  errorMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState<ComboBoxOption | null>(
    null
  );
  const comboBoxRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (value) {
      const foundOption = options.find((option) => option.value === value);
      setSelectedOption(foundOption || null);
    } else {
      setSelectedOption(null);
    }
  }, [value, options]);

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

  const handleSelect = (option: ComboBoxOption) => {
    if (option.disabled) return;

    setSelectedOption(option);
    onChange?.(option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOption(null);
    onChange?.("");
  };

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
    }
  };

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
