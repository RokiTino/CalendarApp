import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { TextInput, Text, TouchableOpacity } from 'react-native';
import { Input } from '../src/components/common/Input';

describe('Input component', () => {
  it('should render without label', () => {
    const tree = TestRenderer.create(
      <Input placeholder="Enter text" onChangeText={() => {}} />
    );
    const instance = tree.root;

    const textInput = instance.findByType(TextInput);
    expect(textInput.props.placeholder).toBe('Enter text');
  });

  it('should render with label', () => {
    const tree = TestRenderer.create(
      <Input label="Email" placeholder="Enter email" onChangeText={() => {}} />
    );
    const instance = tree.root;

    const texts = instance.findAllByType(Text);
    const labelText = texts.find(t => t.props.children === 'Email');
    expect(labelText).toBeDefined();

    const textInput = instance.findByType(TextInput);
    expect(textInput.props.placeholder).toBe('Enter email');
  });

  it('should call onChangeText when text changes', () => {
    const onChangeTextMock = jest.fn();
    const tree = TestRenderer.create(
      <Input placeholder="Type here" onChangeText={onChangeTextMock} />
    );
    const instance = tree.root;

    const textInput = instance.findByType(TextInput);
    act(() => {
      textInput.props.onChangeText('Hello');
    });

    expect(onChangeTextMock).toHaveBeenCalledWith('Hello');
  });

  it('should display error message', () => {
    const tree = TestRenderer.create(
      <Input
        placeholder="Enter email"
        error="Invalid email address"
        onChangeText={() => {}}
      />
    );
    const instance = tree.root;

    const texts = instance.findAllByType(Text);
    const errorText = texts.find(t => t.props.children === 'Invalid email address');
    expect(errorText).toBeDefined();
  });

  it('should have secure text entry when isPassword is true', () => {
    const tree = TestRenderer.create(
      <Input
        placeholder="Password"
        isPassword
        onChangeText={() => {}}
      />
    );
    const instance = tree.root;

    const textInput = instance.findByType(TextInput);
    expect(textInput.props.secureTextEntry).toBe(true);
  });

  it('should toggle password visibility', () => {
    const tree = TestRenderer.create(
      <Input
        placeholder="Password"
        isPassword
        onChangeText={() => {}}
      />
    );
    const instance = tree.root;

    // Find the Show/Hide button
    const touchable = instance.findByType(TouchableOpacity);
    const toggleText = touchable.findByType(Text);
    expect(toggleText.props.children).toBe('Show');

    // Toggle
    act(() => {
      touchable.props.onPress();
    });

    // Now should show "Hide"
    const updatedToggleText = touchable.findByType(Text);
    expect(updatedToggleText.props.children).toBe('Hide');
  });

  it('should handle focus and blur', () => {
    const tree = TestRenderer.create(
      <Input placeholder="Focus me" onChangeText={() => {}} />
    );
    const instance = tree.root;

    const textInput = instance.findByType(TextInput);

    // Focus
    act(() => {
      textInput.props.onFocus();
    });

    // Blur
    act(() => {
      textInput.props.onBlur();
    });

    // Component should still be rendered
    expect(textInput).toBeTruthy();
  });

  it('should render with value', () => {
    const tree = TestRenderer.create(
      <Input
        placeholder="Enter text"
        value="Test value"
        onChangeText={() => {}}
      />
    );
    const instance = tree.root;

    const textInput = instance.findByType(TextInput);
    expect(textInput.props.value).toBe('Test value');
  });

  it('should apply custom container style', () => {
    const tree = TestRenderer.create(
      <Input
        placeholder="Styled input"
        containerStyle={{ marginBottom: 20 }}
        onChangeText={() => {}}
      />
    );
    expect(tree.toJSON()).toBeTruthy();
  });

  it('should render correctly with left icon', () => {
    const tree = TestRenderer.create(
      <Input
        placeholder="With icon"
        leftIcon={<Text>Icon</Text>}
        onChangeText={() => {}}
      />
    );
    expect(tree.toJSON()).toBeTruthy();
  });

  it('should render correctly with right icon when not password', () => {
    const tree = TestRenderer.create(
      <Input
        placeholder="With right icon"
        rightIcon={<Text>Icon</Text>}
        onChangeText={() => {}}
      />
    );
    expect(tree.toJSON()).toBeTruthy();
  });

  it('should handle editable prop', () => {
    const tree = TestRenderer.create(
      <Input
        placeholder="Read only"
        editable={false}
        onChangeText={() => {}}
      />
    );
    const instance = tree.root;

    const textInput = instance.findByType(TextInput);
    expect(textInput.props.editable).toBe(false);
  });
});
