import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const API_BASE_URL = `http://${host}:8080`;

interface CreateVoteModalProps {
  visible: boolean;
  onClose: () => void;
  eventId: number;
  hostId: number;
  onVoteCreated: () => void;
}

const CreateVoteModal: React.FC<CreateVoteModalProps> = ({
  visible,
  onClose,
  eventId,
  hostId,
  onVoteCreated,
}) => {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [creating, setCreating] = useState(false);

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreate = async () => {
    // 유효성 검사
    if (!title.trim()) {
      Alert.alert('오류', '투표 제목을 입력해주세요.');
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      Alert.alert('오류', '최소 2개 이상의 선택지를 입력해주세요.');
      return;
    }

    try {
      setCreating(true);

      const response = await fetch(
        `${API_BASE_URL}/hosts/${hostId}/dating-events/${eventId}/votes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title.trim(),
            options: validOptions,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create vote');
      }

      Alert.alert('성공', '투표가 생성되었습니다.');
      onVoteCreated();
      handleClose();
    } catch (error) {
      console.error('Error creating vote:', error);
      Alert.alert('오류', '투표 생성 중 오류가 발생했습니다.');
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setOptions(['', '']);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>새 투표 만들기</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputSection}>
              <Text style={styles.label}>투표 제목</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="예: 저녁 메뉴 정하기"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.label}>선택지 ({options.length}/10)</Text>
              {options.map((option, index) => (
                <View key={index} style={styles.optionInputContainer}>
                  <TextInput
                    style={styles.optionInput}
                    placeholder={`선택지 ${index + 1}`}
                    value={option}
                    onChangeText={(value) => handleOptionChange(index, value)}
                    maxLength={50}
                  />
                  {options.length > 2 && (
                    <TouchableOpacity
                      onPress={() => handleRemoveOption(index)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="remove-circle" size={24} color="#E53E3E" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              {options.length < 10 && (
                <TouchableOpacity
                  onPress={handleAddOption}
                  style={styles.addOptionButton}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#FF6B9D" />
                  <Text style={styles.addOptionText}>선택지 추가</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.createButton]}
                onPress={handleCreate}
                disabled={creating}
              >
                <Text style={styles.createButtonText}>
                  {creating ? '생성 중...' : '투표 만들기'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D2D2D',
  },
  closeButton: {
    padding: 5,
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: 10,
  },
  titleInput: {
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionInput: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 10,
  },
  removeButton: {
    padding: 5,
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF6B9D',
    borderStyle: 'dashed',
    marginTop: 10,
  },
  addOptionText: {
    color: '#FF6B9D',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E2E8F0',
  },
  createButton: {
    backgroundColor: '#FF6B9D',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateVoteModal; 