"use strict";
(self["webpackChunktelegram_t"] = self["webpackChunktelegram_t"] || []).push([["shared-components"],{

/***/ "./src/components/ui/AvatarEditable.scss":
/*!***********************************************!*\
  !*** ./src/components/ui/AvatarEditable.scss ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/ui/AvatarEditable.tsx":
/*!**********************************************!*\
  !*** ./src/components/ui/AvatarEditable.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _CropModal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CropModal */ "./src/components/ui/CropModal.tsx");
/* harmony import */ var _AvatarEditable_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AvatarEditable.scss */ "./src/components/ui/AvatarEditable.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");







const AvatarEditable = ({
  title,
  disabled,
  isForForum,
  currentAvatarBlobUrl,
  onChange
}) => {
  const [selectedFile, setSelectedFile] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [croppedBlobUrl, setCroppedBlobUrl] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(currentAvatarBlobUrl);
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_2__["default"])();
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setCroppedBlobUrl(currentAvatarBlobUrl);
  }, [currentAvatarBlobUrl]);
  function handleSelectFile(event) {
    const target = event.target;
    if (!target?.files?.[0]) {
      return;
    }
    setSelectedFile(target.files[0]);
    target.value = '';
  }
  const handleAvatarCrop = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(croppedImg => {
    setSelectedFile(undefined);
    onChange(croppedImg);
    if (croppedBlobUrl && croppedBlobUrl !== currentAvatarBlobUrl) {
      URL.revokeObjectURL(croppedBlobUrl);
    }
    setCroppedBlobUrl(URL.createObjectURL(croppedImg));
  }, [croppedBlobUrl, currentAvatarBlobUrl, onChange]);
  const handleModalClose = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setSelectedFile(undefined);
  }, []);
  const labelClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(croppedBlobUrl && 'filled', disabled && 'disabled', isForForum && 'rounded-square');
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    className: "AvatarEditable",
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("label", {
      className: labelClassName,
      role: "button",
      tabIndex: 0,
      title: title || lang('ChangeYourProfilePicture'),
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("input", {
        type: "file",
        onChange: handleSelectFile,
        accept: "image/png, image/jpeg"
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
        name: "camera-add"
      }), croppedBlobUrl && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
        src: croppedBlobUrl,
        draggable: false,
        alt: ""
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_CropModal__WEBPACK_IMPORTED_MODULE_4__["default"], {
      file: selectedFile,
      onClose: handleModalClose,
      onChange: handleAvatarCrop
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(AvatarEditable));

/***/ }),

/***/ "./src/components/ui/Badge.module.scss":
/*!*********************************************!*\
  !*** ./src/components/ui/Badge.module.scss ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"Badge-module__root","default":"Badge-module__default","alternate":"Badge-module__alternate"});

/***/ }),

/***/ "./src/components/ui/Badge.tsx":
/*!*************************************!*\
  !*** ./src/components/ui/Badge.tsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _common_AnimatedCounter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/AnimatedCounter */ "./src/components/common/AnimatedCounter.tsx");
/* harmony import */ var _ShowTransition__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ShowTransition */ "./src/components/ui/ShowTransition.tsx");
/* harmony import */ var _Badge_module_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Badge.module.scss */ "./src/components/ui/Badge.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");






const Badge = ({
  text,
  className,
  isAlternateColor
}) => {
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ShowTransition__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_Badge_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].root, isAlternateColor ? _Badge_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].alternate : _Badge_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"]["default"], className),
    isOpen: Boolean(text),
    children: text && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_common_AnimatedCounter__WEBPACK_IMPORTED_MODULE_2__["default"], {
      text: text
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(Badge));

/***/ }),

/***/ "./src/components/ui/CheckboxGroup.tsx":
/*!*********************************************!*\
  !*** ./src/components/ui/CheckboxGroup.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_iteratees__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/iteratees */ "./src/util/iteratees.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _Checkbox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Checkbox */ "./src/components/ui/Checkbox.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");






const CheckboxGroup = ({
  id,
  options,
  selected,
  disabled,
  nestedCheckbox,
  loadingOptions,
  isRound,
  onChange,
  onClickLabel,
  className
}) => {
  const handleChange = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__["default"])((event, nestedOptionList) => {
    const {
      value,
      checked
    } = event.currentTarget;
    let newValues;
    if (checked) {
      newValues = (0,_util_iteratees__WEBPACK_IMPORTED_MODULE_2__.unique)([...selected, value]);
      nestedOptionList?.forEach(nestedOption => {
        if (!newValues.includes(nestedOption.value)) {
          newValues.push(nestedOption.value);
        }
      });
    } else {
      newValues = selected.filter(v => v !== value);
      if (nestedOptionList) {
        newValues = newValues.filter(v => !nestedOptionList.some(nestedOption => nestedOption.value === v));
      }
    }
    onChange(newValues);
  });
  const getCheckedNestedCount = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__["default"])(nestedOptions => {
    const checkedCount = nestedOptions?.filter(nestedOption => selected.includes(nestedOption.value)).length;
    return checkedCount > 0 ? checkedCount : nestedOptions.length;
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
    id: id,
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('radio-group', className),
    children: options.map(option => {
      return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Checkbox__WEBPACK_IMPORTED_MODULE_4__["default"], {
        label: option.label,
        subLabel: option.subLabel,
        value: option.value,
        peer: option.peer,
        checked: selected?.indexOf(option.value) !== -1,
        disabled: option.disabled || disabled,
        isLoading: loadingOptions ? loadingOptions.indexOf(option.value) !== -1 : undefined,
        onChange: handleChange,
        onClickLabel: onClickLabel,
        nestedCheckbox: nestedCheckbox,
        nestedCheckboxCount: getCheckedNestedCount(option.nestedOptions ?? []),
        nestedOptionList: option.nestedOptions,
        values: selected,
        isRound: isRound
      });
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(CheckboxGroup));

/***/ }),

/***/ "./src/components/ui/ConfirmDialog.tsx":
/*!*********************************************!*\
  !*** ./src/components/ui/ConfirmDialog.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useKeyboardListNavigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useKeyboardListNavigation */ "./src/hooks/useKeyboardListNavigation.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _Modal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Modal */ "./src/components/ui/Modal.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");







const ConfirmDialog = ({
  isOpen,
  title,
  noDefaultTitle,
  header,
  text,
  textParts,
  confirmLabel,
  confirmIsDestructive,
  isConfirmDisabled,
  isOnlyConfirm,
  areButtonsInColumn,
  className,
  children,
  confirmHandler,
  onClose,
  onCloseAnimationEnd
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const containerRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const handleSelectWithEnter = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(index => {
    if (index === -1) confirmHandler();
  }, [confirmHandler]);
  const handleKeyDown = (0,_hooks_useKeyboardListNavigation__WEBPACK_IMPORTED_MODULE_2__["default"])(containerRef, isOpen, handleSelectWithEnter, '.Button');
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_Modal__WEBPACK_IMPORTED_MODULE_5__["default"], {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('confirm', className),
    title: title || (!noDefaultTitle ? lang('Telegram') : undefined),
    header: header,
    isOpen: isOpen,
    onClose: onClose,
    onCloseAnimationEnd: onCloseAnimationEnd,
    children: [text && text.split('\\n').map(textPart => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
      children: textPart
    })), textParts || children, (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: areButtonsInColumn ? 'dialog-buttons-column' : 'dialog-buttons mt-2',
      ref: containerRef,
      onKeyDown: handleKeyDown,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_4__["default"], {
        className: "confirm-dialog-button",
        isText: true,
        onClick: confirmHandler,
        color: confirmIsDestructive ? 'danger' : 'primary',
        disabled: isConfirmDisabled,
        children: confirmLabel || lang('GeneralConfirm')
      }), !isOnlyConfirm && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_4__["default"], {
        className: "confirm-dialog-button",
        isText: true,
        onClick: onClose,
        children: lang('Cancel')
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(ConfirmDialog));

/***/ }),

/***/ "./src/components/ui/CropModal.scss":
/*!******************************************!*\
  !*** ./src/components/ui/CropModal.scss ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/ui/CropModal.tsx":
/*!*****************************************!*\
  !*** ./src/components/ui/CropModal.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _hooks_useImageLoader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../hooks/useImageLoader */ "./src/hooks/useImageLoader.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _ImageCropper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ImageCropper */ "./src/components/ui/ImageCropper.tsx");
/* harmony import */ var _Modal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Modal */ "./src/components/ui/Modal.tsx");
/* harmony import */ var _CropModal_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CropModal.scss */ "./src/components/ui/CropModal.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");







const MAX_OUTPUT_SIZE = 1024;
const MIN_OUTPUT_SIZE = 256;
const CropModal = ({
  file,
  onChange,
  onClose
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const {
    image
  } = (0,_hooks_useImageLoader__WEBPACK_IMPORTED_MODULE_1__["default"])(file);
  const isOpen = Boolean(file) && Boolean(image);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_Modal__WEBPACK_IMPORTED_MODULE_4__["default"], {
    isOpen: isOpen,
    onClose: onClose,
    title: lang('CropperTitle'),
    className: "CropModal",
    hasCloseButton: true,
    isCondensedHeader: true,
    children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ImageCropper__WEBPACK_IMPORTED_MODULE_3__["default"], {
      onChange: onChange,
      image: image,
      maxOutputSize: MAX_OUTPUT_SIZE,
      minOutputSize: MIN_OUTPUT_SIZE
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(CropModal));

/***/ }),

/***/ "./src/components/ui/Draggable.module.scss":
/*!*************************************************!*\
  !*** ./src/components/ui/Draggable.module.scss ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"container":"Draggable-module__container","isDragging":"Draggable-module__isDragging","knob":"Draggable-module__knob","icon":"Draggable-module__icon"});

/***/ }),

/***/ "./src/components/ui/Draggable.tsx":
/*!*****************************************!*\
  !*** ./src/components/ui/Draggable.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/events/getPointerPosition */ "./src/util/events/getPointerPosition.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _Draggable_module_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Draggable.module.scss */ "./src/components/ui/Draggable.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");








const ZERO_POINT = {
  x: 0,
  y: 0
};
const Draggable = ({
  children,
  id,
  onDrag,
  onDragEnd,
  style: externalStyle,
  knobStyle,
  isDisabled
}) => {
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_4__["default"])();
  const ref = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const [state, setState] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)({
    isDragging: false,
    origin: ZERO_POINT,
    translation: ZERO_POINT
  });
  const handleMouseDown = e => {
    e.stopPropagation();
    e.preventDefault();
    const {
      x,
      y
    } = (0,_util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_3__["default"])(e);
    setState({
      ...state,
      isDragging: true,
      origin: {
        x,
        y
      },
      width: ref.current?.offsetWidth,
      height: ref.current?.offsetHeight
    });
  };
  const handleMouseMove = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    const {
      x,
      y
    } = (0,_util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_3__["default"])(e);
    const translation = {
      x: x - state.origin.x,
      y: y - state.origin.y
    };
    setState(current => ({
      ...current,
      translation
    }));
    onDrag(translation, id);
  }, [id, onDrag, state.origin.x, state.origin.y]);
  const handleMouseUp = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setState(current => ({
      ...current,
      isDragging: false,
      width: undefined,
      height: undefined
    }));
    onDragEnd();
  }, [onDragEnd]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (state.isDragging && isDisabled) {
      setState(current => ({
        ...current,
        isDragging: false,
        width: undefined,
        height: undefined
      }));
    }
  }, [isDisabled, state.isDragging]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (state.isDragging) {
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
      window.addEventListener('touchcancel', handleMouseUp);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchcancel', handleMouseUp);
      window.removeEventListener('mouseup', handleMouseUp);
      setState(current => ({
        ...current,
        translation: ZERO_POINT
      }));
    }
    return () => {
      if (state.isDragging) {
        window.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchend', handleMouseUp);
        window.removeEventListener('touchcancel', handleMouseUp);
        window.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [handleMouseMove, handleMouseUp, state.isDragging]);
  const fullClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_Draggable_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].container, state.isDragging && _Draggable_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].isDragging);
  const cssStyles = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_2__["default"])(state.isDragging && `transform: translate(${state.translation.x}px, ${state.translation.y}px)`, state.width ? `width: ${state.width}px` : undefined, state.height ? `height: ${state.height}px` : undefined, externalStyle);
  }, [externalStyle, state.height, state.isDragging, state.translation.x, state.translation.y, state.width]);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    style: cssStyles,
    className: fullClassName,
    ref: ref,
    children: [children, !isDisabled && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      "aria-label": lang('i18n_dragToSort'),
      tabIndex: 0,
      role: "button",
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_Draggable_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].knob, 'div-button', 'draggable-knob'),
      onMouseDown: handleMouseDown,
      onTouchStart: handleMouseDown,
      style: knobStyle,
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_5__["default"], {
        name: "sort",
        className: _Draggable_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].icon
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(Draggable));

/***/ }),

/***/ "./src/components/ui/FloatingActionButton.scss":
/*!*****************************************************!*\
  !*** ./src/components/ui/FloatingActionButton.scss ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/ui/FloatingActionButton.tsx":
/*!****************************************************!*\
  !*** ./src/components/ui/FloatingActionButton.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _common_IconWithSpinner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/IconWithSpinner */ "./src/components/common/IconWithSpinner.tsx");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _FloatingActionButton_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FloatingActionButton.scss */ "./src/components/ui/FloatingActionButton.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");






const FloatingActionButton = ({
  isShown,
  iconName,
  className,
  color = 'primary',
  ariaLabel,
  disabled,
  isLoading,
  onClick
}) => {
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_1__["default"])();
  const buttonClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_0__["default"])('FloatingActionButton', isShown && 'revealed', className);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: buttonClassName,
    color: color,
    round: true,
    disabled: disabled,
    onClick: isShown && !disabled ? onClick : undefined,
    ariaLabel: ariaLabel,
    tabIndex: -1,
    isRtl: lang.isRtl,
    children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_common_IconWithSpinner__WEBPACK_IMPORTED_MODULE_2__["default"], {
      iconName: iconName,
      isLoading: isLoading
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FloatingActionButton);

/***/ }),

/***/ "./src/components/ui/Folder.module.scss":
/*!**********************************************!*\
  !*** ./src/components/ui/Folder.module.scss ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"folder":"Folder-module__folder","no-page-transitions":"Folder-module__no-page-transitions","noPageTransitions":"Folder-module__no-page-transitions","inner":"Folder-module__inner","title":"Folder-module__title","icon":"Folder-module__icon","badge":"Folder-module__badge","badge-active":"Folder-module__badge-active","badgeActive":"Folder-module__badge-active","blocked":"Folder-module__blocked","active":"Folder-module__active"});

/***/ }),

/***/ "./src/components/ui/Folder.tsx":
/*!**************************************!*\
  !*** ./src/components/ui/Folder.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useContextMenuHandlers */ "./src/hooks/useContextMenuHandlers.ts");
/* harmony import */ var _hooks_useFastClick__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useFastClick */ "./src/hooks/useFastClick.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _common_FolderIcon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/FolderIcon */ "./src/components/common/FolderIcon.tsx");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Menu */ "./src/components/ui/Menu.tsx");
/* harmony import */ var _MenuItem__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./MenuItem */ "./src/components/ui/MenuItem.tsx");
/* harmony import */ var _MenuSeparator__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./MenuSeparator */ "./src/components/ui/MenuSeparator.tsx");
/* harmony import */ var _Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Folder.module.scss */ "./src/components/ui/Folder.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");














const Folder = ({
  className,
  title,
  isActive,
  isBlocked,
  badgeCount,
  isBadgeActive,
  contextActions,
  contextRootElementSelector,
  icon,
  clickArg,
  onClick
}) => {
  const folderRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const [isHovering, markHovering, unmarkHovering] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_5__["default"])();
  const {
    contextMenuAnchor,
    handleContextMenu,
    handleBeforeContextMenu,
    handleContextMenuClose,
    handleContextMenuHide,
    isContextMenuOpen
  } = (0,_hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_3__["default"])(folderRef, !contextActions);
  const {
    handleClick,
    handleMouseDown
  } = (0,_hooks_useFastClick__WEBPACK_IMPORTED_MODULE_4__.useFastClick)(e => {
    if (contextActions && (e.button === _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_1__.MouseButton.Secondary || !onClick)) {
      handleBeforeContextMenu(e);
    }
    if (e.type === 'mousedown' && e.button !== _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_1__.MouseButton.Main) {
      return;
    }
    onClick?.(clickArg);
  });
  const getTriggerElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => folderRef.current);
  const getRootElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => contextRootElementSelector ? folderRef.current.closest(contextRootElementSelector) : document.body);
  const getMenuElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => document.querySelector(`.${_Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].contextMenu} .bubble`));
  const getLayout = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => ({
    withPortal: true
  }));
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_2__["default"])(_Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].folder, isActive && _Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].active, className),
    onClick: handleClick,
    onMouseDown: handleMouseDown,
    onContextMenu: handleContextMenu,
    onMouseEnter: markHovering,
    onMouseLeave: unmarkHovering,
    ref: folderRef,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
      className: _Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].icon,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_common_FolderIcon__WEBPACK_IMPORTED_MODULE_7__["default"], {
        emoji: typeof icon === 'string' ? icon : undefined,
        customEmojiId: typeof icon === 'object' ? icon.documentId : undefined,
        shouldAnimate: isHovering
      }), Boolean(badgeCount) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_2__["default"])(_Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].badge, isBadgeActive && _Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].badgeActive),
        children: badgeCount
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
      className: _Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].inner,
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
        className: _Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].title,
        children: [isBlocked && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_8__["default"], {
          name: "lock-badge",
          className: _Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].blocked
        }), title]
      })
    }), contextActions && contextMenuAnchor !== undefined && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_Menu__WEBPACK_IMPORTED_MODULE_9__["default"], {
      isOpen: isContextMenuOpen,
      anchor: contextMenuAnchor,
      getTriggerElement: getTriggerElement,
      getRootElement: getRootElement,
      getMenuElement: getMenuElement,
      getLayout: getLayout,
      className: _Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].contextMenu,
      autoClose: true,
      onClose: handleContextMenuClose,
      onCloseAnimationEnd: handleContextMenuHide,
      withPortal: true,
      children: contextActions.map(action => 'isSeparator' in action ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_MenuSeparator__WEBPACK_IMPORTED_MODULE_11__["default"], {}, action.key || 'separator') : (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_MenuItem__WEBPACK_IMPORTED_MODULE_10__["default"], {
        icon: action.icon,
        destructive: action.destructive,
        disabled: !action.handler,
        onClick: action.handler,
        children: action.title
      }, action.title))
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Folder);

/***/ }),

/***/ "./src/components/ui/ImageCropper.module.scss":
/*!****************************************************!*\
  !*** ./src/components/ui/ImageCropper.module.scss ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"previewContainer":"ImageCropper-module__previewContainer","foregroundImage":"ImageCropper-module__foregroundImage","backgroundImage":"ImageCropper-module__backgroundImage","previewMask":"ImageCropper-module__previewMask","cropArea":"ImageCropper-module__cropArea","confirmButton":"ImageCropper-module__confirmButton","zoomSlider":"ImageCropper-module__zoomSlider","bottomControls":"ImageCropper-module__bottomControls"});

/***/ }),

/***/ "./src/components/ui/ImageCropper.tsx":
/*!********************************************!*\
  !*** ./src/components/ui/ImageCropper.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/events/getPointerPosition */ "./src/util/events/getPointerPosition.ts");
/* harmony import */ var _util_files__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/files */ "./src/util/files.ts");
/* harmony import */ var _util_math__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../util/math */ "./src/util/math.ts");
/* harmony import */ var _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/helpers/mediaDimensions */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_window_useWindowSize__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/window/useWindowSize */ "./src/hooks/window/useWindowSize.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _RangeSlider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./RangeSlider */ "./src/components/ui/RangeSlider.tsx");
/* harmony import */ var _ImageCropper_module_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ImageCropper.module.scss */ "./src/components/ui/ImageCropper.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");












const PREVIEW_SIZE = 400;
const MIN_ZOOM = 100;
const MAX_ZOOM = 200;
const CROP_AREA_INSET = 0.125 * _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_5__.REM;
const MODAL_INLINE_PADDING = _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_5__.REM * 2;
const ImageCropper = ({
  onChange,
  image,
  maxOutputSize,
  minOutputSize
}) => {
  const [imagePosition, setImagePosition] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)({
    x: 0,
    y: 0
  });
  const [zoom, setZoom] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(MIN_ZOOM);
  const isDragging = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const lastMousePosition = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    x: 0,
    y: 0
  });
  const lastImagePosition = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    x: 0,
    y: 0
  });
  const {
    width: windowWidth
  } = (0,_hooks_window_useWindowSize__WEBPACK_IMPORTED_MODULE_7__["default"])();
  const previewContainerSize = Math.min(PREVIEW_SIZE, windowWidth - MODAL_INLINE_PADDING * 2);
  const scaleFactor = image ? Math.max(previewContainerSize / image.width, previewContainerSize / image.height) : 1;
  const zoomFactor = scaleFactor * zoom / 100;
  const previewImageSize = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!image) return {
      width: 0,
      height: 0
    };
    return {
      width: image.width * zoomFactor,
      height: image.height * zoomFactor
    };
  }, [image, zoomFactor]);
  const clampPosition = (x, y, previewSize) => {
    const radius = previewContainerSize / 2;
    const imgHalfWidth = previewSize.width / 2;
    const imgHalfHeight = previewSize.height / 2;
    const maxOffsetX = Math.max(0, imgHalfWidth - radius);
    const maxOffsetY = Math.max(0, imgHalfHeight - radius);
    return {
      x: (0,_util_math__WEBPACK_IMPORTED_MODULE_4__.clamp)(x, -maxOffsetX, maxOffsetX),
      y: (0,_util_math__WEBPACK_IMPORTED_MODULE_4__.clamp)(y, -maxOffsetY, maxOffsetY)
    };
  };
  const startDrag = e => {
    isDragging.current = true;
    lastMousePosition.current = (0,_util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_2__["default"])(e);
    lastImagePosition.current = {
      ...imagePosition
    };
    document.addEventListener('mousemove', moveDrag);
    document.addEventListener('touchmove', moveDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
  };
  const moveDrag = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(e => {
    if ('touches' in e && e.touches.length > 1) return;
    if (!isDragging.current) return;
    const {
      x: mouseX,
      y: mouseY
    } = (0,_util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_2__["default"])(e);
    const deltaX = mouseX - lastMousePosition.current.x;
    const deltaY = mouseY - lastMousePosition.current.y;
    const newPosition = clampPosition(lastImagePosition.current.x + deltaX, lastImagePosition.current.y + deltaY, previewImageSize);
    setImagePosition(newPosition);
  });
  const endDrag = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    isDragging.current = false;
    document.removeEventListener('mousemove', moveDrag);
    document.removeEventListener('touchmove', moveDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchend', endDrag);
  });
  const handleZoomChange = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(newZoom => {
    const newZoomFactor = scaleFactor * newZoom / 100;
    const newPreviewImageSize = {
      width: image.width * newZoomFactor,
      height: image.height * newZoomFactor
    };
    const ratio = newZoom / zoom;
    const newPosition = clampPosition(imagePosition.x * ratio, imagePosition.y * ratio, newPreviewImageSize);
    setZoom(newZoom);
    setImagePosition(newPosition);
  });
  const handleCrop = () => {
    if (!image) return;
    const cropSize = previewContainerSize / zoomFactor;
    const cropX = image.width / 2 - cropSize / 2 - imagePosition.x / zoomFactor;
    const cropY = image.height / 2 - cropSize / 2 - imagePosition.y / zoomFactor;
    const outputSize = Math.min(maxOutputSize, Math.max(minOutputSize, cropSize));
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, cropX, cropY, cropSize, cropSize, 0, 0, outputSize, outputSize);
    canvas.toBlob(blob => {
      if (blob) onChange((0,_util_files__WEBPACK_IMPORTED_MODULE_3__.blobToFile)(blob, 'avatar.jpg'));
    }, 'image/jpeg');
  };
  if (!image) return undefined;
  const imageLeft = (previewContainerSize - previewImageSize.width) / 2 + imagePosition.x;
  const imageTop = (previewContainerSize - previewImageSize.height) / 2 + imagePosition.y;
  const backgroundImageStyle = (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_1__["default"])(`width: ${previewImageSize.width}px`, `height: ${previewImageSize.height}px`, `left: ${imageLeft}px`, `top: ${imageTop}px`);
  const foregroundImageStyle = (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_1__["default"])(`width: ${previewImageSize.width}px`, `height: ${previewImageSize.height}px`, `left: ${imageLeft - CROP_AREA_INSET}px`, `top: ${imageTop - CROP_AREA_INSET}px`);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: _ImageCropper_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].previewContainer,
      style: (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_1__["default"])(`width: ${previewContainerSize}px`, `height: ${previewContainerSize}px`),
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("img", {
        src: image.src,
        className: _ImageCropper_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].backgroundImage,
        style: backgroundImageStyle,
        draggable: false,
        onMouseDown: startDrag,
        onTouchStart: startDrag,
        alt: "",
        role: "presentation"
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
        className: _ImageCropper_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].previewMask
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
        className: _ImageCropper_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].cropArea,
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("img", {
          src: image.src,
          className: _ImageCropper_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].foregroundImage,
          style: foregroundImageStyle,
          draggable: false,
          alt: "",
          role: "presentation"
        })
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: _ImageCropper_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].bottomControls,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_RangeSlider__WEBPACK_IMPORTED_MODULE_9__["default"], {
        className: _ImageCropper_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].zoomSlider,
        min: MIN_ZOOM,
        max: MAX_ZOOM,
        value: zoom,
        onChange: handleZoomChange
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_8__["default"], {
        className: _ImageCropper_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].confirmButton,
        round: true,
        color: "primary",
        iconName: "check",
        onClick: handleCrop,
        ariaLabel: "Crop"
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(ImageCropper));

/***/ }),

/***/ "./src/components/ui/InfiniteScroll.tsx":
/*!**********************************************!*\
  !*** ./src/components/ui/InfiniteScroll.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../types */ "./src/types/index.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _util_resetScroll__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../util/resetScroll */ "./src/util/resetScroll.ts");
/* harmony import */ var _util_schedulers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../util/schedulers */ "./src/util/schedulers.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");









const DEFAULT_LIST_SELECTOR = '.ListItem';
const DEFAULT_PRELOAD_BACKWARDS = 20;
const DEFAULT_SENSITIVE_AREA = 800;
const InfiniteScroll = ({
  ref,
  style,
  className,
  items,
  itemSelector = DEFAULT_LIST_SELECTOR,
  preloadBackwards = DEFAULT_PRELOAD_BACKWARDS,
  sensitiveArea = DEFAULT_SENSITIVE_AREA,
  withAbsolutePositioning,
  maxHeight,
  // Used to turn off restoring scroll position (e.g. for frequently re-ordered chat or user lists)
  noScrollRestore = false,
  noScrollRestoreOnTop = false,
  noFastList,
  // Used to re-query `listItemElements` if rendering is delayed by transition
  cacheBuster,
  beforeChildren,
  children,
  scrollContainerClosest,
  onLoadMore,
  onScroll,
  onWheel,
  onClick,
  onKeyDown
}) => {
  let containerRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  if (ref) {
    containerRef = ref;
  }
  const stateRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)({});
  const [loadMoreBackwards, loadMoreForwards] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!onLoadMore) {
      return [];
    }
    return [(0,_util_schedulers__WEBPACK_IMPORTED_MODULE_6__.debounce)((noScroll = false) => {
      onLoadMore({
        direction: _types__WEBPACK_IMPORTED_MODULE_1__.LoadMoreDirection.Backwards,
        noScroll
      });
    }, 1000, true, false), (0,_util_schedulers__WEBPACK_IMPORTED_MODULE_6__.debounce)(() => {
      onLoadMore({
        direction: _types__WEBPACK_IMPORTED_MODULE_1__.LoadMoreDirection.Forwards
      });
    }, 1000, true, false)];
    // eslint-disable-next-line react-hooks-static-deps/exhaustive-deps
  }, [onLoadMore, items]);

  // Initial preload
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const scrollContainer = scrollContainerClosest ? containerRef.current.closest(scrollContainerClosest) : containerRef.current;
    if (!loadMoreBackwards || !scrollContainer) {
      return;
    }
    if (preloadBackwards > 0 && (!items || items.length < preloadBackwards)) {
      loadMoreBackwards(true);
      return;
    }
    const {
      scrollHeight,
      clientHeight
    } = scrollContainer;
    if (clientHeight && scrollHeight < clientHeight) {
      loadMoreBackwards();
    }
  }, [items, loadMoreBackwards, preloadBackwards, scrollContainerClosest]);

  // Restore `scrollTop` after adding items
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const scrollContainer = scrollContainerClosest ? containerRef.current.closest(scrollContainerClosest) : containerRef.current;
    const container = containerRef.current;
    (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_2__.requestForcedReflow)(() => {
      const state = stateRef.current;
      state.listItemElements = container.querySelectorAll(itemSelector);
      let newScrollTop;
      if (state.currentAnchor && Array.from(state.listItemElements).includes(state.currentAnchor)) {
        const {
          scrollTop
        } = scrollContainer;
        const newAnchorTop = state.currentAnchor.getBoundingClientRect().top;
        newScrollTop = scrollTop + (newAnchorTop - state.currentAnchorTop);
      } else {
        const nextAnchor = state.listItemElements[0];
        if (nextAnchor) {
          state.currentAnchor = nextAnchor;
          state.currentAnchorTop = nextAnchor.getBoundingClientRect().top;
        }
      }
      if (withAbsolutePositioning || noScrollRestore) {
        return undefined;
      }
      const {
        scrollTop
      } = scrollContainer;
      if (noScrollRestoreOnTop && scrollTop === 0) {
        return undefined;
      }
      return () => {
        (0,_util_resetScroll__WEBPACK_IMPORTED_MODULE_5__["default"])(scrollContainer, newScrollTop);
        state.isScrollTopJustUpdated = true;
      };
    });
  }, [items, itemSelector, noScrollRestore, noScrollRestoreOnTop, cacheBuster, withAbsolutePositioning, scrollContainerClosest]);
  const handleScroll = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_7__["default"])(e => {
    if (loadMoreForwards && loadMoreBackwards) {
      const {
        isScrollTopJustUpdated,
        currentAnchor,
        currentAnchorTop
      } = stateRef.current;
      const listItemElements = stateRef.current.listItemElements;
      if (isScrollTopJustUpdated) {
        stateRef.current.isScrollTopJustUpdated = false;
        return;
      }
      const listLength = listItemElements.length;
      const scrollContainer = scrollContainerClosest ? containerRef.current.closest(scrollContainerClosest) : containerRef.current;
      const {
        scrollTop,
        scrollHeight,
        offsetHeight
      } = scrollContainer;
      const top = listLength ? listItemElements[0].offsetTop : 0;
      const isNearTop = scrollTop <= top + sensitiveArea;
      const bottom = listLength ? listItemElements[listLength - 1].offsetTop + listItemElements[listLength - 1].offsetHeight : scrollHeight;
      const isNearBottom = bottom - (scrollTop + offsetHeight) <= sensitiveArea;
      let isUpdated = false;
      if (isNearTop) {
        const nextAnchor = listItemElements[0];
        if (nextAnchor) {
          const nextAnchorTop = nextAnchor.getBoundingClientRect().top;
          const newAnchorTop = currentAnchor?.offsetParent && currentAnchor !== nextAnchor ? currentAnchor.getBoundingClientRect().top : nextAnchorTop;
          const isMovingUp = currentAnchor && currentAnchorTop !== undefined && newAnchorTop > currentAnchorTop;
          if (isMovingUp) {
            stateRef.current.currentAnchor = nextAnchor;
            stateRef.current.currentAnchorTop = nextAnchorTop;
            isUpdated = true;
            loadMoreForwards();
          }
        }
      }
      if (isNearBottom) {
        const nextAnchor = listItemElements[listLength - 1];
        if (nextAnchor) {
          const nextAnchorTop = nextAnchor.getBoundingClientRect().top;
          const newAnchorTop = currentAnchor?.offsetParent && currentAnchor !== nextAnchor ? currentAnchor.getBoundingClientRect().top : nextAnchorTop;
          const isMovingDown = currentAnchor && currentAnchorTop !== undefined && newAnchorTop < currentAnchorTop;
          if (isMovingDown) {
            stateRef.current.currentAnchor = nextAnchor;
            stateRef.current.currentAnchorTop = nextAnchorTop;
            isUpdated = true;
            loadMoreBackwards();
          }
        }
      }
      if (!isUpdated) {
        if (currentAnchor?.offsetParent) {
          stateRef.current.currentAnchorTop = currentAnchor.getBoundingClientRect().top;
        } else {
          const nextAnchor = listItemElements[0];
          if (nextAnchor) {
            stateRef.current.currentAnchor = nextAnchor;
            stateRef.current.currentAnchorTop = nextAnchor.getBoundingClientRect().top;
          }
        }
      }
    }
    if (onScroll) {
      onScroll(e);
    }
  });
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const scrollContainer = scrollContainerClosest ? containerRef.current.closest(scrollContainerClosest) : containerRef.current;
    if (!scrollContainer) return undefined;
    const handleNativeScroll = e => handleScroll(e);
    scrollContainer.addEventListener('scroll', handleNativeScroll);
    return () => {
      scrollContainer.removeEventListener('scroll', handleNativeScroll);
    };
  }, [handleScroll, scrollContainerClosest]);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
    ref: containerRef,
    className: className,
    style: style,
    teactFastList: !noFastList && !withAbsolutePositioning,
    onClick: onClick,
    onKeyDown: onKeyDown,
    onWheel: onWheel,
    children: [beforeChildren, withAbsolutePositioning && items?.length ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      teactFastList: !noFastList,
      style: (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_4__["default"])('position: relative', _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_3__.IS_ANDROID && `height: ${maxHeight}px`),
      children: children
    }) : children]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InfiniteScroll);

/***/ }),

/***/ "./src/components/ui/ListItem.scss":
/*!*****************************************!*\
  !*** ./src/components/ui/ListItem.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/ui/ListItem.tsx":
/*!****************************************!*\
  !*** ./src/components/ui/ListItem.tsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _common_helpers_renderText__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/helpers/renderText */ "./src/components/common/helpers/renderText.tsx");
/* harmony import */ var _hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useContextMenuHandlers */ "./src/hooks/useContextMenuHandlers.ts");
/* harmony import */ var _hooks_useFastClick__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useFastClick */ "./src/hooks/useFastClick.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Menu */ "./src/components/ui/Menu.tsx");
/* harmony import */ var _MenuItem__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./MenuItem */ "./src/components/ui/MenuItem.tsx");
/* harmony import */ var _MenuSeparator__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./MenuSeparator */ "./src/components/ui/MenuSeparator.tsx");
/* harmony import */ var _RippleEffect__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./RippleEffect */ "./src/components/ui/RippleEffect.tsx");
/* harmony import */ var _ListItem_scss__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./ListItem.scss */ "./src/components/ui/ListItem.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");


















const ListItem = ({
  ref,
  buttonRef,
  icon,
  iconClassName,
  leftElement,
  buttonClassName,
  menuBubbleClassName,
  secondaryIcon,
  secondaryIconClassName,
  rightElement,
  className,
  style,
  children,
  disabled,
  allowDisabledClick,
  ripple,
  narrow,
  inactive,
  focus,
  destructive,
  withPrimaryColor,
  multiline,
  isStatic,
  allowSelection,
  withColorTransition,
  contextActions,
  withPortalForMenu,
  href,
  nonInteractive,
  onClick,
  clickArg,
  onMouseDown,
  onContextMenu,
  onSecondaryIconClick,
  onDragEnter,
  onDragLeave
}) => {
  let containerRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  if (ref) {
    containerRef = ref;
  }
  const [isTouched, markIsTouched, unmarkIsTouched] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_7__["default"])();
  const {
    isContextMenuOpen,
    contextMenuAnchor,
    handleBeforeContextMenu,
    handleContextMenu,
    handleContextMenuClose,
    handleContextMenuHide
  } = (0,_hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_5__["default"])(containerRef, !contextActions);
  const getTriggerElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__["default"])(() => containerRef.current);
  const getRootElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__["default"])(() => containerRef.current.closest('.custom-scroll'));
  const getMenuElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__["default"])(() => {
    return (withPortalForMenu ? document.querySelector('#portals') : containerRef.current).querySelector('.ListItem-context-menu .bubble');
  });
  const getLayout = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__["default"])(() => ({
    withPortal: withPortalForMenu
  }));
  const handleClickEvent = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__["default"])(e => {
    const hasModifierKey = e.ctrlKey || e.metaKey || e.shiftKey;
    if (!hasModifierKey && e.button === _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.MouseButton.Main) {
      if (href && !onClick) return; // Allow default behavior for opening links
      e.preventDefault();
    }
  });
  const handleClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__["default"])(e => {
    if (disabled && !allowDisabledClick) {
      return;
    }
    if (href) {
      // Allow default behavior for opening links in new tab
      const hasModifierKey = e.ctrlKey || e.metaKey || e.shiftKey;
      if (hasModifierKey && e.button === _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.MouseButton.Main || e.button === _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.MouseButton.Auxiliary) {
        return;
      }
      if (onClick) e.preventDefault();
    }
    if (!onClick) return;
    onClick(e, clickArg);
    if (_util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.IS_TOUCH_ENV && !ripple) {
      markIsTouched();
      (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestMeasure)(unmarkIsTouched);
    }
  });
  const {
    handleClick: handleSecondaryIconClick,
    handleMouseDown: handleSecondaryIconMouseDown
  } = (0,_hooks_useFastClick__WEBPACK_IMPORTED_MODULE_6__.useFastClick)(e => {
    if (disabled && !allowDisabledClick || e.button !== 0 || !onSecondaryIconClick && !contextActions) return;
    e.stopPropagation();
    if (onSecondaryIconClick) {
      onSecondaryIconClick(e);
    } else {
      handleContextMenu(e);
    }
  });
  const handleMouseDown = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__["default"])(e => {
    if (inactive || _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.IS_TOUCH_ENV) {
      return;
    }
    if (contextActions && (e.button === _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.MouseButton.Secondary || !onClick)) {
      handleBeforeContextMenu(e);
    }
    if (e.button === _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.MouseButton.Main) {
      if (!onClick) {
        handleContextMenu(e);
      } else {
        handleClick(e);
      }
    }
  });
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_8__["default"])();
  const fullClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('ListItem', className, allowSelection && 'allow-selection', ripple && 'has-ripple', narrow && 'narrow', disabled && 'disabled', allowDisabledClick && 'click-allowed', inactive && 'inactive', contextMenuAnchor && 'has-menu-open', focus && 'focus', destructive && 'destructive', withPrimaryColor && 'primary', multiline && 'multiline', isStatic && 'is-static', withColorTransition && 'with-color-transition');
  const ButtonElementTag = href ? 'a' : 'div';
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)("div", {
    ref: containerRef,
    className: fullClassName,
    dir: lang.isRtl ? 'rtl' : undefined,
    style: style,
    onMouseDown: onMouseDown,
    onDragEnter: onDragEnter,
    onDragLeave: onDragLeave,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)(ButtonElementTag, {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('ListItem-button', isTouched && 'active', buttonClassName),
      role: !isStatic && !href ? 'button' : undefined,
      href: href
      // @ts-expect-error TS requires specific types for refs
      ,
      ref: buttonRef,
      rel: href ? 'noopener noreferrer' : undefined,
      tabIndex: !isStatic ? 0 : undefined,
      onClick: !inactive && _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.IS_TOUCH_ENV ? handleClick : handleClickEvent,
      onMouseDown: handleMouseDown,
      onContextMenu: onContextMenu || (!inactive && contextActions ? handleContextMenu : undefined),
      "aria-disabled": disabled || undefined,
      children: [!disabled && !inactive && ripple && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_RippleEffect__WEBPACK_IMPORTED_MODULE_15__["default"], {}), leftElement, icon && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_10__["default"], {
        name: icon,
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('ListItem-main-icon', iconClassName)
      }), multiline && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)("div", {
        className: "multiline-item",
        children: children
      }), !multiline && children, secondaryIcon && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_11__["default"], {
        nonInteractive: nonInteractive,
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('secondary-icon', secondaryIconClassName),
        round: true,
        color: "translucent",
        size: "smaller",
        onClick: handleSecondaryIconClick,
        onMouseDown: handleSecondaryIconMouseDown,
        iconName: secondaryIcon
      }), rightElement]
    }), contextActions && contextMenuAnchor !== undefined && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_Menu__WEBPACK_IMPORTED_MODULE_12__["default"], {
      isOpen: isContextMenuOpen,
      anchor: contextMenuAnchor,
      getTriggerElement: getTriggerElement,
      getRootElement: getRootElement,
      getMenuElement: getMenuElement,
      getLayout: getLayout,
      className: "ListItem-context-menu with-menu-transitions",
      autoClose: true,
      onClose: handleContextMenuClose,
      onCloseAnimationEnd: handleContextMenuHide,
      withPortal: withPortalForMenu,
      bubbleClassName: menuBubbleClassName,
      children: contextActions.map(action => 'isSeparator' in action ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_MenuSeparator__WEBPACK_IMPORTED_MODULE_14__["default"], {}, action.key || 'separator') : (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_MenuItem__WEBPACK_IMPORTED_MODULE_13__["default"], {
        icon: action.icon,
        destructive: action.destructive,
        disabled: !action.handler,
        onClick: action.handler,
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)("span", {
          className: "list-item-ellipsis",
          children: (0,_common_helpers_renderText__WEBPACK_IMPORTED_MODULE_4__["default"])(action.title)
        })
      }, action.title))
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ListItem);

/***/ }),

/***/ "./src/components/ui/MenuSeparator.module.scss":
/*!*****************************************************!*\
  !*** ./src/components/ui/MenuSeparator.module.scss ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"MenuSeparator-module__root","thin":"MenuSeparator-module__thin","thick":"MenuSeparator-module__thick"});

/***/ }),

/***/ "./src/components/ui/MenuSeparator.tsx":
/*!*********************************************!*\
  !*** ./src/components/ui/MenuSeparator.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _MenuSeparator_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MenuSeparator.module.scss */ "./src/components/ui/MenuSeparator.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");



const MenuSeparator = ({
  className,
  size = 'thin'
}) => {
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_0__["default"])(_MenuSeparator_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].root, _MenuSeparator_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"][size], className)
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MenuSeparator);

/***/ }),

/***/ "./src/components/ui/Modal.tsx":
/*!*************************************!*\
  !*** ./src/components/ui/Modal.tsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ANIMATION_DURATION: () => (/* binding */ ANIMATION_DURATION),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_captureKeyboardListeners__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/captureKeyboardListeners */ "./src/util/captureKeyboardListeners.ts");
/* harmony import */ var _util_directInputManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/directInputManager */ "./src/util/directInputManager.ts");
/* harmony import */ var _util_trapFocus__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../util/trapFocus */ "./src/util/trapFocus.ts");
/* harmony import */ var _hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useContextMenuHandlers */ "./src/hooks/useContextMenuHandlers.ts");
/* harmony import */ var _hooks_useHistoryBack__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useHistoryBack */ "./src/hooks/useHistoryBack.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useLayoutEffectWithPrevDeps__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../hooks/useLayoutEffectWithPrevDeps */ "./src/hooks/useLayoutEffectWithPrevDeps.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../hooks/useShowTransition */ "./src/hooks/useShowTransition.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Menu */ "./src/components/ui/Menu.tsx");
/* harmony import */ var _ModalStarBalanceBar__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./ModalStarBalanceBar */ "./src/components/ui/ModalStarBalanceBar.tsx");
/* harmony import */ var _Portal__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./Portal */ "./src/components/ui/Portal.ts");
/* harmony import */ var _Modal_scss__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./Modal.scss */ "./src/components/ui/Modal.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");

















const ANIMATION_DURATION = 200;
const Modal = ({
  dialogRef,
  title,
  className,
  contentClassName,
  headerClassName,
  isOpen,
  isSlim,
  header,
  hasCloseButton,
  hasAbsoluteCloseButton,
  absoluteCloseButtonColor = 'translucent',
  noBackdrop,
  noBackdropClose,
  children,
  style,
  dialogStyle,
  isLowStackPriority,
  dialogContent,
  dialogClassName,
  moreMenuItems,
  onClose,
  onCloseAnimationEnd,
  onEnter,
  withBalanceBar,
  isCondensedHeader,
  currencyInBalanceBar = 'XTR'
}) => {
  const {
    ref: modalRef,
    shouldRender
  } = (0,_hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_10__["default"])({
    isOpen,
    onCloseAnimationEnd,
    withShouldRender: true
  });
  const localDialogRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const moreButtonRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const menuRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const {
    isContextMenuOpen,
    contextMenuAnchor,
    handleContextMenu,
    handleContextMenuClose,
    handleContextMenuHide
  } = (0,_hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_5__["default"])(moreButtonRef);
  const actualDialogRef = dialogRef || localDialogRef;
  const getRootElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_7__["default"])(() => actualDialogRef.current);
  const getTriggerElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_7__["default"])(() => moreButtonRef.current);
  const getMenuElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_7__["default"])(() => menuRef.current);
  const getLayout = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_7__["default"])(() => ({
    withPortal: true
  }));
  const withCloseButton = hasCloseButton || hasAbsoluteCloseButton;
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isOpen) {
      return undefined;
    }
    (0,_util_directInputManager__WEBPACK_IMPORTED_MODULE_3__.disableDirectTextInput)();
    return _util_directInputManager__WEBPACK_IMPORTED_MODULE_3__.enableDirectTextInput;
  }, [isOpen]);
  const handleEnter = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_7__["default"])(e => {
    if (!onEnter) {
      return false;
    }
    e.preventDefault();
    onEnter();
    return true;
  });
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => isOpen ? (0,_util_captureKeyboardListeners__WEBPACK_IMPORTED_MODULE_2__["default"])({
    onEsc: onClose,
    onEnter: handleEnter
  }) : undefined, [isOpen, onClose, handleEnter]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => isOpen && modalRef.current ? (0,_util_trapFocus__WEBPACK_IMPORTED_MODULE_4__["default"])(modalRef.current) : undefined, [isOpen, modalRef]);
  (0,_hooks_useHistoryBack__WEBPACK_IMPORTED_MODULE_6__["default"])({
    isActive: isOpen,
    onBack: onClose
  });
  (0,_hooks_useLayoutEffectWithPrevDeps__WEBPACK_IMPORTED_MODULE_8__["default"])(([prevIsOpen]) => {
    document.body.classList.toggle('has-open-dialog', Boolean(isOpen));
    if (isOpen || !isOpen && prevIsOpen !== undefined) {
      (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.beginHeavyAnimation)(ANIMATION_DURATION);
    }
    return () => {
      document.body.classList.remove('has-open-dialog');
    };
  }, [isOpen]);
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_9__["default"])();
  if (!shouldRender) {
    return undefined;
  }
  function renderHeader() {
    if (header) {
      return header;
    }
    const closeButton = withCloseButton ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_11__["default"], {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(hasAbsoluteCloseButton && 'modal-absolute-close-button'),
      round: true,
      color: absoluteCloseButtonColor,
      size: "tiny",
      iconName: "close",
      ariaLabel: lang('Close'),
      onClick: onClose
    }) : undefined;
    return title ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('modal-header', headerClassName, isCondensedHeader && 'modal-header-condensed'),
      children: [closeButton, (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
        className: "modal-title",
        children: title
      })]
    }) : closeButton;
  }
  const fullClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('Modal', className, noBackdrop && 'transparent-backdrop', isSlim && 'slim', isLowStackPriority && 'low-priority', withBalanceBar && 'with-balance-bar');
  const modalDialogClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('modal-dialog', dialogClassName);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_Portal__WEBPACK_IMPORTED_MODULE_14__["default"], {
    children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
      ref: modalRef,
      className: fullClassName,
      tabIndex: -1,
      role: "dialog",
      children: [withBalanceBar && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_ModalStarBalanceBar__WEBPACK_IMPORTED_MODULE_13__["default"], {
        isModalOpen: isOpen,
        currency: currencyInBalanceBar
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
        className: "modal-container",
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
          className: "modal-backdrop",
          onClick: !noBackdropClose ? onClose : undefined
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
          className: modalDialogClassName,
          ref: actualDialogRef,
          style: dialogStyle,
          children: [renderHeader(), Boolean(moreMenuItems) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.Fragment, {
            children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_11__["default"], {
              ref: moreButtonRef,
              className: "modal-more-button",
              round: true,
              color: absoluteCloseButtonColor,
              size: "tiny",
              iconName: "more",
              ariaLabel: lang('AriaMoreButton'),
              onClick: handleContextMenu,
              onContextMenu: handleContextMenu
            }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)(_Menu__WEBPACK_IMPORTED_MODULE_12__["default"], {
              ref: menuRef,
              isOpen: isContextMenuOpen,
              anchor: contextMenuAnchor,
              autoClose: true,
              withPortal: true,
              positionX: "right",
              onClose: handleContextMenuClose,
              onCloseAnimationEnd: handleContextMenuHide,
              getRootElement: getRootElement,
              getTriggerElement: getTriggerElement,
              getMenuElement: getMenuElement,
              getLayout: getLayout,
              children: moreMenuItems
            })]
          }), dialogContent, (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
            className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('modal-content custom-scroll', contentClassName),
            style: style,
            children: children
          })]
        })]
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Modal);

/***/ }),

/***/ "./src/components/ui/ModalStarBalanceBar.module.scss":
/*!***********************************************************!*\
  !*** ./src/components/ui/ModalStarBalanceBar.module.scss ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"ModalStarBalanceBar-module__root","dots":"ModalStarBalanceBar-module__dots","starIcon":"ModalStarBalanceBar-module__starIcon","tonInUsdDescription":"ModalStarBalanceBar-module__tonInUsdDescription"});

/***/ }),

/***/ "./src/components/ui/ModalStarBalanceBar.tsx":
/*!***************************************************!*\
  !*** ./src/components/ui/ModalStarBalanceBar.tsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../global */ "./src/global/index.ts");
/* harmony import */ var _global_helpers_payments__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../global/helpers/payments */ "./src/global/helpers/payments.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_formatCurrency__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../util/formatCurrency */ "./src/util/formatCurrency.tsx");
/* harmony import */ var _util_localization_format__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../util/localization/format */ "./src/util/localization/format.tsx");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../hooks/useShowTransition */ "./src/hooks/useShowTransition.ts");
/* harmony import */ var _Link__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Link */ "./src/components/ui/Link.tsx");
/* harmony import */ var _ModalStarBalanceBar_module_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ModalStarBalanceBar.module.scss */ "./src/components/ui/ModalStarBalanceBar.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");












function ModalStarBalanceBar({
  starBalance,
  tonBalance,
  tonUsdRate,
  isModalOpen,
  currency,
  onCloseAnimationEnd
}) {
  const {
    openStarsBalanceModal
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_6__["default"])();
  const isTonMode = currency === 'TON';
  const currentBalance = isTonMode ? tonBalance : starBalance;
  const isOpen = isModalOpen ? Boolean(currentBalance) : false;
  const {
    ref,
    shouldRender
  } = (0,_hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_8__["default"])({
    isOpen,
    onCloseAnimationEnd,
    withShouldRender: true
  });
  const handleGetMoreStars = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_7__["default"])(() => {
    openStarsBalanceModal(isTonMode ? {
      currency: 'TON'
    } : {});
  });
  if (!shouldRender || !currentBalance) {
    return undefined;
  }
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])(_ModalStarBalanceBar_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].root),
    ref: ref,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
      children: isTonMode ? lang('ModalStarsBalanceBarDescription', {
        stars: (0,_util_localization_format__WEBPACK_IMPORTED_MODULE_5__.formatTonAsIcon)(lang, (0,_util_formatCurrency__WEBPACK_IMPORTED_MODULE_4__.convertTonFromNanos)(currentBalance.amount), {
          className: _ModalStarBalanceBar_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].starIcon
        })
      }, {
        withNodes: true,
        withMarkdown: true
      }) : lang('ModalStarsBalanceBarDescription', {
        stars: (0,_util_localization_format__WEBPACK_IMPORTED_MODULE_5__.formatStarsAsIcon)(lang, (0,_global_helpers_payments__WEBPACK_IMPORTED_MODULE_2__.formatStarsAmount)(lang, currentBalance), {
          className: _ModalStarBalanceBar_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].starIcon
        })
      }, {
        withNodes: true,
        withMarkdown: true
      })
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      children: [isTonMode && Boolean(tonUsdRate) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
        className: _ModalStarBalanceBar_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].tonInUsdDescription,
        style: "color: var(--color-text-secondary)",
        children: `≈ ${(0,_util_formatCurrency__WEBPACK_IMPORTED_MODULE_4__.formatCurrencyAsString)((0,_util_formatCurrency__WEBPACK_IMPORTED_MODULE_4__.convertTonToUsd)(currentBalance.amount, tonUsdRate, true), 'USD', lang.code)}`
      }), !isTonMode && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_Link__WEBPACK_IMPORTED_MODULE_9__["default"], {
        isPrimary: true,
        onClick: handleGetMoreStars,
        children: lang('GetMoreStarsLinkText')
      })]
    })]
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)(global => {
  const {
    stars,
    ton
  } = global;
  return {
    starBalance: stars?.balance,
    tonBalance: ton?.balance,
    tonUsdRate: global.appConfig.tonUsdRate
  };
})(ModalStarBalanceBar)));

/***/ }),

/***/ "./src/components/ui/NestedMenuItem.tsx":
/*!**********************************************!*\
  !*** ./src/components/ui/NestedMenuItem.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/helpers/mediaDimensions */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useUniqueId__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/useUniqueId */ "./src/hooks/useUniqueId.ts");
/* harmony import */ var _hooks_window_useWindowSize__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../hooks/window/useWindowSize */ "./src/hooks/window/useWindowSize.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Menu */ "./src/components/ui/Menu.tsx");
/* harmony import */ var _MenuItem__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./MenuItem */ "./src/components/ui/MenuItem.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");













const OPEN_TIMEOUT = 150;
const CLOSE_TIMEOUT = 150;
const NestedMenuItem = ({
  icon,
  customIcon,
  submenuIcon,
  className,
  children,
  submenu,
  submenuClassName,
  disabled,
  destructive,
  ariaLabel,
  footer
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_5__["default"])();
  const itemRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const closeTimeoutRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const openTimeoutRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const submenuId = (0,_hooks_useUniqueId__WEBPACK_IMPORTED_MODULE_7__["default"])();
  const isClosingRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const [isSubmenuOpen, openSubmenu, closeSubmenu] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_4__["default"])(false);
  (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useUnmountCleanup)(() => {
    clearTimeout(closeTimeoutRef.current);
    clearTimeout(openTimeoutRef.current);
  });
  const [submenuAnchor, setSubmenuAnchor] = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const {
    isResizing
  } = (0,_hooks_window_useWindowSize__WEBPACK_IMPORTED_MODULE_8__["default"])();
  const updateAnchor = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestMeasure)(() => {
      if (!itemRef.current) return;
      const rect = itemRef.current.getBoundingClientRect();
      const overlap = _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_3__.REM;
      setSubmenuAnchor({
        x: lang.isRtl ? rect.left + overlap : rect.right - overlap,
        y: rect.top,
        width: rect.width - overlap * 2,
        height: rect.height
      });
    });
  });
  (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isSubmenuOpen && !isResizing) {
      updateAnchor();
    }
  }, [isSubmenuOpen, lang.isRtl, updateAnchor, isResizing]);
  const cancelOpen = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    clearTimeout(openTimeoutRef.current);
    openTimeoutRef.current = undefined;
  });
  const cancelClose = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = undefined;
  });
  const scheduleOpen = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    cancelClose();
    cancelOpen();
    openTimeoutRef.current = window.setTimeout(() => {
      openTimeoutRef.current = undefined;
      // Don't open if the parent menu is closing
      const parentBubble = itemRef.current?.closest('.bubble');
      if (parentBubble?.classList.contains('closing')) return;
      openSubmenu();
    }, OPEN_TIMEOUT);
  });
  const scheduleClose = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    cancelOpen();
    cancelClose();
    closeTimeoutRef.current = window.setTimeout(() => {
      closeSubmenu();
      closeTimeoutRef.current = undefined;
    }, CLOSE_TIMEOUT);
  });
  const handleMouseEnter = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    if (disabled) return;
    scheduleOpen();
  });
  const handleSubmenuMouseEnter = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    cancelOpen();
    cancelClose();
  });
  const handleSubmenuMouseLeave = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    scheduleClose();
  });
  const closeParentMenu = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    const parentMenu = itemRef.current?.closest('.Menu');
    if (parentMenu) {
      const backdrop = parentMenu.querySelector('.backdrop');
      if (backdrop) {
        const event = new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        backdrop.dispatchEvent(event);
      }
    }
  });
  const handleSubmenuClose = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    cancelOpen();
    cancelClose();
    closeSubmenu();
    closeParentMenu();

    // Reset after a short delay
    setTimeout(() => {
      isClosingRef.current = false;
    }, 100);
  });
  const getTriggerElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => itemRef.current);
  const getRootElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => document.body);
  const getMenuElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => document.getElementById(submenuId)?.querySelector('.bubble'));
  const getLayout = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => ({
    withPortal: true
  }));
  const handleClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(e => {
    e.stopPropagation();
    if (disabled || isSubmenuOpen) return;
    openSubmenu();
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: scheduleClose,
    ref: itemRef,
    children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)(_MenuItem__WEBPACK_IMPORTED_MODULE_11__["default"], {
      icon: icon,
      customIcon: customIcon,
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_2__["default"])(className, 'submenu'),
      disabled: disabled,
      destructive: destructive,
      ariaLabel: ariaLabel,
      onClick: handleClick,
      children: [children, (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_9__["default"], {
        name: submenuIcon || (lang.isRtl ? 'previous' : 'next'),
        className: "submenu-icon"
      }), submenuAnchor && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_Menu__WEBPACK_IMPORTED_MODULE_10__["default"], {
        id: submenuId,
        isOpen: isSubmenuOpen,
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_2__["default"])('submenu', submenuClassName),
        anchor: submenuAnchor,
        positionX: lang.isRtl ? 'left' : 'right',
        getTriggerElement: getTriggerElement,
        getRootElement: getRootElement,
        getMenuElement: getMenuElement,
        getLayout: getLayout,
        autoClose: true,
        nested: true,
        withPortal: true,
        footer: footer,
        onClose: handleSubmenuClose,
        onMouseEnter: handleSubmenuMouseEnter,
        onMouseLeave: handleSubmenuMouseLeave,
        children: submenu
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NestedMenuItem);

/***/ }),

/***/ "./src/components/ui/ProgressSpinner.scss":
/*!************************************************!*\
  !*** ./src/components/ui/ProgressSpinner.scss ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/ui/ProgressSpinner.tsx":
/*!***********************************************!*\
  !*** ./src/components/ui/ProgressSpinner.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_animation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/animation */ "./src/util/animation.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_stickers_useDynamicColorListener__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/stickers/useDynamicColorListener */ "./src/hooks/stickers/useDynamicColorListener.ts");
/* harmony import */ var _hooks_useStateRef__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useStateRef */ "./src/hooks/useStateRef.ts");
/* harmony import */ var _hooks_window_useDevicePixelRatio__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/window/useDevicePixelRatio */ "./src/hooks/window/useDevicePixelRatio.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _ProgressSpinner_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ProgressSpinner.scss */ "./src/components/ui/ProgressSpinner.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");










const SIZES = {
  s: 42,
  m: 48,
  l: 54,
  xl: 52
};
const STROKE_WIDTH = 2;
const STROKE_WIDTH_XL = 3;
const PADDING = 2;
const MIN_PROGRESS = 0.05;
const MAX_PROGRESS = 1;
const GROW_DURATION = 600; // 0.6 s
const ROTATE_DURATION = 2000; // 2 s

const ProgressSpinner = ({
  progress = 0,
  size = 'l',
  square,
  transparent,
  noCross,
  rotationOffset,
  withColor,
  onClick
}) => {
  const canvasRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const width = SIZES[size];
  const progressRef = (0,_hooks_useStateRef__WEBPACK_IMPORTED_MODULE_5__.useStateRef)(progress);
  const dpr = (0,_hooks_window_useDevicePixelRatio__WEBPACK_IMPORTED_MODULE_6__["default"])();
  const color = (0,_hooks_stickers_useDynamicColorListener__WEBPACK_IMPORTED_MODULE_4__["default"])(canvasRef, undefined, !withColor);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    let isFirst = true;
    let growFrom = MIN_PROGRESS;
    let growStartedAt;
    let prevProgress;
    (0,_util_animation__WEBPACK_IMPORTED_MODULE_2__.animate)(() => {
      if (!canvasRef.current) {
        return false;
      }
      if (progressRef.current !== prevProgress) {
        growFrom = Math.min(Math.max(MIN_PROGRESS, prevProgress || 0), MAX_PROGRESS);
        growStartedAt = Date.now();
        prevProgress = progressRef.current;
      }
      const targetProgress = Math.min(Math.max(MIN_PROGRESS, progressRef.current), MAX_PROGRESS);
      const t = Math.min(1, (Date.now() - growStartedAt) / GROW_DURATION);
      const animationFactor = _util_animation__WEBPACK_IMPORTED_MODULE_2__.timingFunctions.easeOutQuad(t);
      const currentProgress = growFrom + (targetProgress - growFrom) * animationFactor;
      drawSpinnerArc(canvasRef.current, width * dpr, (size === 'xl' ? STROKE_WIDTH_XL : STROKE_WIDTH) * dpr, color ?? 'white', currentProgress, dpr, isFirst, rotationOffset);
      isFirst = false;
      return currentProgress < 1;
    }, _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestMutation);
  }, [progressRef, size, width, dpr, rotationOffset, color]);
  const className = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])(`ProgressSpinner size-${size}`, transparent && 'transparent', square && 'square', noCross && 'no-cross');
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    className: className,
    onClick: onClick,
    children: [!noCross && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_7__["default"], {
      name: "close"
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("canvas", {
      ref: canvasRef,
      className: "ProgressSpinner_canvas",
      style: `width: ${width}; height: ${width}px;`
    })]
  });
};
function drawSpinnerArc(canvas, size, strokeWidth, color, progress, dpr, shouldInit = false, rotationOffset) {
  const centerCoordinate = size / 2;
  const radius = (size - strokeWidth) / 2 - PADDING * dpr;
  const offset = rotationOffset ?? Date.now() % ROTATE_DURATION / ROTATE_DURATION;
  const startAngle = 2 * Math.PI * offset;
  const endAngle = startAngle + 2 * Math.PI * progress;
  const ctx = canvas.getContext('2d');
  if (shouldInit) {
    canvas.width = size;
    canvas.height = size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
  }
  ctx.clearRect(0, 0, size, size);
  ctx.beginPath();
  ctx.arc(centerCoordinate, centerCoordinate, radius, startAngle, endAngle);
  ctx.stroke();
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(ProgressSpinner));

/***/ }),

/***/ "./src/components/ui/Radio.scss":
/*!**************************************!*\
  !*** ./src/components/ui/Radio.scss ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/ui/Radio.tsx":
/*!*************************************!*\
  !*** ./src/components/ui/Radio.tsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _Spinner__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Spinner */ "./src/components/ui/Spinner.tsx");
/* harmony import */ var _Radio_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Radio.scss */ "./src/components/ui/Radio.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");






const Radio = ({
  id,
  label,
  subLabel,
  subLabelClassName,
  value,
  name,
  checked,
  disabled,
  hidden,
  isLoading,
  className,
  onlyInput,
  withIcon,
  isLink,
  onChange,
  onSubLabelClick,
  isCanCheckedInDisabled
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const fullClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('Radio', className, disabled && 'disabled', hidden && 'hidden-widget', withIcon && 'with-icon', isLoading && 'loading', onlyInput && 'onlyInput', Boolean(subLabel) && 'withSubLabel', isCanCheckedInDisabled && 'canCheckedInDisabled');
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("label", {
    className: fullClassName,
    dir: lang.isRtl ? 'rtl' : undefined,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
      type: "radio",
      name: name,
      value: value,
      id: id,
      checked: checked,
      onChange: onChange,
      disabled: disabled || hidden
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "Radio-main",
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
        className: "label",
        dir: lang.isRtl ? 'auto' : undefined,
        children: label
      }), Boolean(subLabel) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(subLabelClassName, 'subLabel', isLink ? 'subLabelLink' : undefined),
        dir: lang.isRtl ? 'auto' : undefined,
        onClick: isLink ? onSubLabelClick : undefined,
        children: subLabel
      })]
    }), isLoading && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Spinner__WEBPACK_IMPORTED_MODULE_3__["default"], {})]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(Radio));

/***/ }),

/***/ "./src/components/ui/RadioGroup.tsx":
/*!******************************************!*\
  !*** ./src/components/ui/RadioGroup.tsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _Radio__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Radio */ "./src/components/ui/Radio.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");





const RadioGroup = ({
  id,
  name,
  options,
  selected,
  disabled,
  loadingOption,
  onChange,
  onClickAction,
  subLabelClassName,
  isLink,
  withIcon,
  subLabel,
  className
}) => {
  const handleChange = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(event => {
    const {
      value
    } = event.currentTarget;
    onChange(value, event);
  }, [onChange]);
  const onSubLabelClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__["default"])(value => () => {
    onClickAction?.(value);
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    id: id,
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('radio-group', className),
    children: options.map(option => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Radio__WEBPACK_IMPORTED_MODULE_3__["default"], {
      name: name,
      label: option.label,
      subLabel: subLabel || option.subLabel,
      subLabelClassName: subLabelClassName,
      value: option.value,
      checked: option.value === selected,
      hidden: option.hidden,
      isCanCheckedInDisabled: option.isCanCheckedInDisabled,
      disabled: disabled,
      withIcon: withIcon,
      isLoading: loadingOption ? loadingOption === option.value : undefined,
      className: option.className,
      onChange: handleChange,
      onSubLabelClick: onSubLabelClick(option.value),
      isLink: isLink
    }))
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(RadioGroup));

/***/ }),

/***/ "./src/components/ui/RangeSlider.scss":
/*!********************************************!*\
  !*** ./src/components/ui/RangeSlider.scss ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/ui/RangeSlider.tsx":
/*!*******************************************!*\
  !*** ./src/components/ui/RangeSlider.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _RangeSlider_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./RangeSlider.scss */ "./src/components/ui/RangeSlider.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");





const RangeSlider = ({
  options,
  min = 0,
  max = options ? options.length - 1 : 100,
  step = 1,
  label,
  value,
  disabled,
  readOnly,
  bold,
  className,
  renderValue,
  onChange,
  isCenteredLayout
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const handleChange = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(event => {
    onChange(Number(event.currentTarget.value));
  }, [onChange]);
  const mainClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(className, 'RangeSlider', disabled && 'disabled', readOnly && 'readOnly', bold && 'bold');
  const trackWidth = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (options) {
      return value / (options.length - 1) * 100;
    } else {
      const possibleValuesLength = (max - min) / step;
      return (value - min) / possibleValuesLength * 100;
    }
  }, [options, value, max, min, step]);
  function renderTopRow() {
    if (isCenteredLayout) {
      return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "slider-top-row",
        dir: lang.isRtl ? 'rtl' : undefined,
        children: !options && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
          children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
            className: "value-min",
            dir: "auto",
            children: min
          }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
            className: "label",
            dir: "auto",
            children: renderValue ? renderValue(value) : value
          }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
            className: "value-max",
            dir: "auto",
            children: max
          })]
        })
      });
    }
    if (!label) {
      return undefined;
    }
    return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "slider-top-row",
      dir: lang.isRtl ? 'rtl' : undefined,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
        className: "label",
        dir: "auto",
        children: label
      }), !options && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
        className: "value",
        dir: "auto",
        children: renderValue ? renderValue(value) : value
      })]
    });
  }
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: mainClassName,
    children: [renderTopRow(), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "slider-main",
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "slider-fill-track",
        style: `width: ${trackWidth}%`
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
        min: min,
        max: max,
        value: value,
        step: step,
        type: "range",
        className: "RangeSlider__input",
        onChange: handleChange
      }), options && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "slider-options",
        children: options.map((option, index) => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('slider-option', index === value && 'active'),
          onClick: () => onChange(index),
          children: option
        }))
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(RangeSlider));

/***/ }),

/***/ "./src/components/ui/RangeSliderWithMarks.module.scss":
/*!************************************************************!*\
  !*** ./src/components/ui/RangeSliderWithMarks.module.scss ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"dotWrapper":"RangeSliderWithMarks-module__dotWrapper","sliderContainer":"RangeSliderWithMarks-module__sliderContainer","marksContainer":"RangeSliderWithMarks-module__marksContainer","mark":"RangeSliderWithMarks-module__mark","active":"RangeSliderWithMarks-module__active","slider":"RangeSliderWithMarks-module__slider","tickMarks":"RangeSliderWithMarks-module__tickMarks","tick":"RangeSliderWithMarks-module__tick","filled":"RangeSliderWithMarks-module__filled","tickUnfilled":"RangeSliderWithMarks-module__tickUnfilled"});

/***/ }),

/***/ "./src/components/ui/RangeSliderWithMarks.tsx":
/*!****************************************************!*\
  !*** ./src/components/ui/RangeSliderWithMarks.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RangeSliderWithMarks.module.scss */ "./src/components/ui/RangeSliderWithMarks.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");




const RangeSliderWithMarks = ({
  marks,
  onChange,
  rangeCount
}) => {
  const sliderRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const rangeCountIndex = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => marks.indexOf(rangeCount), [marks, rangeCount]);
  const rangeValue = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return marks.indexOf(rangeCount).toString();
  }, [marks, rangeCount]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    if (sliderRef.current) {
      const fillPercentage = rangeCountIndex / (marks.length - 1) * 100;
      const thumbOffset = fillPercentage / 2;
      sliderRef.current.style.setProperty('--fill-percentage', `${fillPercentage}%`);
      sliderRef.current.style.setProperty('--thumb-offset', `${thumbOffset}%`);
    }
  }, [rangeCountIndex, marks]);
  const handleChange = event => {
    const index = parseInt(event.target.value, 10);
    const newValue = marks[index];
    onChange(newValue);
  };
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: _RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].dotWrapper,
    children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("form", {
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: _RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].sliderContainer,
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: _RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].tickMarks,
          children: marks.map((mark, index) => {
            const isFilled = index <= rangeCountIndex;
            return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
              className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].tick, isFilled ? _RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].filled : _RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].tickUnfilled)
            }, mark);
          })
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: _RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].marksContainer,
          children: marks.map(mark => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].mark, rangeCount === mark && _RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].active),
            children: mark
          }, mark))
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
          ref: sliderRef,
          type: "range",
          className: _RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].slider,
          min: "0",
          max: marks.length - 1,
          value: rangeValue,
          onChange: handleChange,
          step: "1"
        })]
      })
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(RangeSliderWithMarks));

/***/ }),

/***/ "./src/components/ui/ResponsiveHoverButton.tsx":
/*!*****************************************************!*\
  !*** ./src/components/ui/ResponsiveHoverButton.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");





const BUTTON_ACTIVATE_DELAY = 200;
let openTimeout;
let isFirstTimeActivation = true;
const ResponsiveHoverButton = ({
  onActivate,
  ...buttonProps
}) => {
  const isMouseInside = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const handleMouseEnter = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__["default"])(e => {
    isMouseInside.current = true;

    // This is used to counter additional delay caused by asynchronous module loading
    if (isFirstTimeActivation) {
      isFirstTimeActivation = false;
      onActivate(e);
      return;
    }
    if (openTimeout) {
      clearTimeout(openTimeout);
      openTimeout = undefined;
    }
    openTimeout = window.setTimeout(() => {
      if (isMouseInside.current) {
        onActivate(e);
      }
    }, BUTTON_ACTIVATE_DELAY);
  });
  const handleMouseLeave = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__["default"])(() => {
    isMouseInside.current = false;
  });
  const handleClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__["default"])(e => {
    isMouseInside.current = true;
    onActivate(e);
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_3__["default"], {
    ...buttonProps,
    onMouseEnter: !_util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_1__.IS_TOUCH_ENV ? handleMouseEnter : undefined,
    onMouseLeave: !_util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_1__.IS_TOUCH_ENV ? handleMouseLeave : undefined,
    onClick: !_util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_1__.IS_TOUCH_ENV ? onActivate : handleClick
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ResponsiveHoverButton);

/***/ }),

/***/ "./src/components/ui/SearchInput.scss":
/*!********************************************!*\
  !*** ./src/components/ui/SearchInput.scss ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/ui/SearchInput.tsx":
/*!*******************************************!*\
  !*** ./src/components/ui/SearchInput.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_browser_globalEnvironment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/browser/globalEnvironment */ "./src/util/browser/globalEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useInputFocusOnOpen__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useInputFocusOnOpen */ "./src/hooks/useInputFocusOnOpen.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _Loading__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Loading */ "./src/components/ui/Loading.tsx");
/* harmony import */ var _Transition__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Transition */ "./src/components/ui/Transition.tsx");
/* harmony import */ var _SearchInput_scss__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./SearchInput.scss */ "./src/components/ui/SearchInput.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");














const SearchInput = ({
  ref,
  children,
  resultsItemSelector,
  value,
  inputId,
  className,
  focused,
  isLoading = false,
  spinnerColor,
  spinnerBackgroundColor,
  placeholder,
  disabled,
  autoComplete,
  canClose,
  autoFocusSearch,
  hasUpButton,
  hasDownButton,
  teactExperimentControlled,
  withBackIcon,
  onChange,
  onStartBackspace,
  onReset,
  onFocus,
  onBlur,
  onClick,
  onUpClick,
  onDownClick,
  onSpinnerClick,
  onEnter
}) => {
  let inputRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  if (ref) {
    inputRef = ref;
  }
  const [isInputFocused, markInputFocused, unmarkInputFocused] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_3__["default"])(focused);
  (0,_hooks_useInputFocusOnOpen__WEBPACK_IMPORTED_MODULE_4__["default"])(inputRef, autoFocusSearch, unmarkInputFocused);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!inputRef.current) {
      return;
    }
    if (focused) {
      inputRef.current.focus();
    } else {
      inputRef.current.blur();
    }
  }, [focused, placeholder]); // Trick for setting focus when selecting a contact to search for

  const oldLang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_7__["default"])();
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_5__["default"])();
  function handleChange(event) {
    const {
      currentTarget
    } = event;
    onChange(currentTarget.value);
    if (!isInputFocused) {
      handleFocus();
    }
  }
  function handleFocus() {
    markInputFocused();
    onFocus?.();
  }
  function handleBlur() {
    unmarkInputFocused();
    onBlur?.();
  }
  const handleKeyDown = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(e => {
    if (e.key === 'Enter') {
      if (onEnter) {
        e.preventDefault();
        onEnter();
        return;
      }
      if (resultsItemSelector) {
        const element = document.querySelector(resultsItemSelector);
        if (element) {
          element.focus();
        }
      }
    }
    if (resultsItemSelector && e.key === 'ArrowDown') {
      const element = document.querySelector(resultsItemSelector);
      if (element) {
        element.focus();
      }
    }
    if (e.key === 'Backspace' && e.currentTarget.selectionStart === 0 && e.currentTarget.selectionEnd === 0) {
      onStartBackspace?.();
    }
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_2__["default"])('SearchInput', className, isInputFocused && 'has-focus'),
    onClick: onClick,
    dir: lang.isRtl ? 'rtl' : undefined,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_Transition__WEBPACK_IMPORTED_MODULE_11__["default"], {
      name: "fade",
      shouldCleanup: true,
      activeKey: Number(!isLoading && !withBackIcon),
      className: "icon-container-left",
      slideClassName: "icon-container-slide",
      children: isLoading && !withBackIcon ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_Loading__WEBPACK_IMPORTED_MODULE_10__["default"], {
        color: spinnerColor,
        backgroundColor: spinnerBackgroundColor,
        onClick: onSpinnerClick
      }) : withBackIcon ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_8__["default"], {
        name: "arrow-left",
        className: "back-icon",
        onClick: onReset
      }) : (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_8__["default"], {
        name: "search",
        className: "search-icon"
      })
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
      children: children
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("input", {
      ref: inputRef,
      id: inputId,
      type: "text",
      dir: "auto",
      placeholder: placeholder || oldLang('Search'),
      className: "form-control",
      value: value,
      disabled: disabled,
      autoComplete: autoComplete,
      spellCheck: _util_browser_globalEnvironment__WEBPACK_IMPORTED_MODULE_1__.IS_TAURI ? false : undefined,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      teactExperimentControlled: teactExperimentControlled
    }), hasUpButton && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_9__["default"], {
      round: true,
      size: "tiny",
      color: "translucent",
      iconName: "up",
      onClick: onUpClick,
      disabled: !onUpClick,
      ariaLabel: lang('AriaSearchOlderResult')
    }), hasDownButton && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_9__["default"], {
      round: true,
      size: "tiny",
      color: "translucent",
      iconName: "down",
      onClick: onDownClick,
      disabled: !onDownClick,
      ariaLabel: lang('AriaSearchNewerResult')
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_Transition__WEBPACK_IMPORTED_MODULE_11__["default"], {
      name: "fade",
      shouldCleanup: true,
      activeKey: Number(isLoading),
      className: "icon-container-right",
      slideClassName: "icon-container-slide",
      children: withBackIcon && isLoading ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_Loading__WEBPACK_IMPORTED_MODULE_10__["default"], {
        color: spinnerColor,
        backgroundColor: spinnerBackgroundColor,
        onClick: onSpinnerClick
      }) : (value || canClose) && onReset && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_9__["default"], {
        round: true,
        size: "tiny",
        color: "translucent",
        iconName: "close",
        onClick: onReset
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(SearchInput));

/***/ }),

/***/ "./src/components/ui/Select.tsx":
/*!**************************************!*\
  !*** ./src/components/ui/Select.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");



const Select = props => {
  const {
    id,
    value,
    label,
    hasArrow,
    error,
    ref,
    tabIndex,
    onChange,
    children
  } = props;
  const labelText = error || label;
  const fullClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('input-group', value && 'touched', error && 'error', labelText && 'with-label', hasArrow && 'with-arrow', 'input-group');
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: fullClassName,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("select", {
      className: "form-control",
      id: id,
      value: value || '',
      onChange: onChange,
      tabIndex: tabIndex,
      ref: ref,
      children: children
    }), labelText && id && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
      htmlFor: id,
      children: labelText
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(Select));

/***/ }),

/***/ "./src/components/ui/SelectAvatar.module.scss":
/*!****************************************************!*\
  !*** ./src/components/ui/SelectAvatar.module.scss ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"input":"SelectAvatar-module__input"});

/***/ }),

/***/ "./src/components/ui/SelectAvatar.tsx":
/*!********************************************!*\
  !*** ./src/components/ui/SelectAvatar.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_systemFilesDialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/systemFilesDialog */ "./src/util/systemFilesDialog.ts");
/* harmony import */ var _CropModal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CropModal */ "./src/components/ui/CropModal.tsx");
/* harmony import */ var _SelectAvatar_module_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SelectAvatar.module.scss */ "./src/components/ui/SelectAvatar.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");





const SelectAvatar = ({
  onChange,
  inputRef
}) => {
  const [selectedFile, setSelectedFile] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const handleAvatarCrop = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(croppedImg => {
    setSelectedFile(undefined);
    onChange(croppedImg);
  }, [onChange]);
  const handleModalClose = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setSelectedFile(undefined);
  }, []);
  const handleClick = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    (0,_util_systemFilesDialog__WEBPACK_IMPORTED_MODULE_1__.openSystemFilesDialog)('image/png, image/jpeg', event => {
      const target = event.target;
      if (!target?.files?.[0]) {
        return;
      }
      setSelectedFile(target.files[0]);
    }, true);
  }, []);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
      ref: inputRef,
      className: _SelectAvatar_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].input,
      onClick: handleClick
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_CropModal__WEBPACK_IMPORTED_MODULE_2__["default"], {
      file: selectedFile,
      onClose: handleModalClose,
      onChange: handleAvatarCrop
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(SelectAvatar));

/***/ }),

/***/ "./src/components/ui/Separator.module.scss":
/*!*************************************************!*\
  !*** ./src/components/ui/Separator.module.scss ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"separator":"Separator-module__separator"});

/***/ }),

/***/ "./src/components/ui/Separator.tsx":
/*!*****************************************!*\
  !*** ./src/components/ui/Separator.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _Separator_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Separator.module.scss */ "./src/components/ui/Separator.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");




function Separator({
  children,
  className
}) {
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    dir: lang.isRtl ? 'rtl' : undefined,
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_0__["default"])(_Separator_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].separator, className),
    children: children
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Separator);

/***/ }),

/***/ "./src/components/ui/ShowMoreButton.scss":
/*!***********************************************!*\
  !*** ./src/components/ui/ShowMoreButton.scss ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/ui/ShowMoreButton.tsx":
/*!**********************************************!*\
  !*** ./src/components/ui/ShowMoreButton.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _ShowMoreButton_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ShowMoreButton.scss */ "./src/components/ui/ShowMoreButton.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");




const ShowMoreButton = ({
  count,
  itemName,
  itemPluralName,
  isLoading,
  onClick
}) => {
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_0__["default"])();
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_Button__WEBPACK_IMPORTED_MODULE_1__["default"], {
    className: "ShowMoreButton",
    color: "translucent",
    isText: true,
    isLoading: isLoading,
    isRtl: lang.isRtl,
    onClick: onClick,
    iconName: "down",
    children: ["Show", ' ', count, ' ', "more", ' ', count > 1 ? itemPluralName || `${itemName}s` : itemName]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ShowMoreButton);

/***/ }),

/***/ "./src/components/ui/ShowTransition.tsx":
/*!**********************************************!*\
  !*** ./src/components/ui/ShowTransition.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _hooks_usePreviousDeprecated__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../hooks/usePreviousDeprecated */ "./src/hooks/usePreviousDeprecated.ts");
/* harmony import */ var _hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useShowTransition */ "./src/hooks/useShowTransition.ts");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");




const ShowTransition = ({
  isOpen,
  isHidden,
  isCustom,
  id,
  className,
  onClick,
  children,
  noCloseTransition,
  shouldAnimateFirstRender,
  style,
  ref: externalRef
}) => {
  const prevIsOpen = (0,_hooks_usePreviousDeprecated__WEBPACK_IMPORTED_MODULE_1__["default"])(isOpen);
  const prevChildren = (0,_hooks_usePreviousDeprecated__WEBPACK_IMPORTED_MODULE_1__["default"])(children);
  const fromChildrenRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const isFirstRender = prevIsOpen === undefined;
  const {
    ref,
    shouldRender
  } = (0,_hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_2__["default"])({
    isOpen: isOpen && !isHidden,
    ref: externalRef,
    noMountTransition: isFirstRender && !shouldAnimateFirstRender,
    className: isCustom ? false : undefined,
    noCloseTransition,
    withShouldRender: true
  });
  if (prevIsOpen && !isOpen) {
    fromChildrenRef.current = prevChildren;
  }
  return (shouldRender || isHidden) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    id: id,
    ref: ref,
    className: className,
    onClick: onClick,
    style: style,
    children: isOpen ? children : fromChildrenRef.current
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ShowTransition);

/***/ }),

/***/ "./src/components/ui/Switcher.scss":
/*!*****************************************!*\
  !*** ./src/components/ui/Switcher.scss ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/ui/Switcher.tsx":
/*!****************************************!*\
  !*** ./src/components/ui/Switcher.tsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _Switcher_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Switcher.scss */ "./src/components/ui/Switcher.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");




const Switcher = ({
  id,
  name,
  value,
  label,
  checked = false,
  disabled,
  inactive,
  noAnimation,
  onChange,
  onCheck
}) => {
  const handleChange = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    if (onChange) {
      onChange(e);
    }
    if (onCheck) {
      onCheck(e.currentTarget.checked);
    }
  }, [onChange, onCheck]);
  const className = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('Switcher', disabled && 'disabled', inactive && 'inactive', noAnimation && 'no-animation');
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
    className: className,
    title: label,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
      type: "checkbox",
      id: id,
      name: name,
      value: value,
      checked: checked,
      disabled: disabled,
      onChange: handleChange
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
      className: "widget"
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(Switcher));

/***/ }),

/***/ "./src/components/ui/Tab.scss":
/*!************************************!*\
  !*** ./src/components/ui/Tab.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/ui/Tab.tsx":
/*!***********************************!*\
  !*** ./src/components/ui/Tab.tsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_forceReflow__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../util/forceReflow */ "./src/util/forceReflow.ts");
/* harmony import */ var _common_helpers_renderText__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/helpers/renderText */ "./src/components/common/helpers/renderText.tsx");
/* harmony import */ var _hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useContextMenuHandlers */ "./src/hooks/useContextMenuHandlers.ts");
/* harmony import */ var _hooks_useFastClick__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/useFastClick */ "./src/hooks/useFastClick.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Menu */ "./src/components/ui/Menu.tsx");
/* harmony import */ var _MenuItem__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./MenuItem */ "./src/components/ui/MenuItem.tsx");
/* harmony import */ var _MenuSeparator__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./MenuSeparator */ "./src/components/ui/MenuSeparator.tsx");
/* harmony import */ var _Tab_scss__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./Tab.scss */ "./src/components/ui/Tab.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");















const classNames = {
  active: 'Tab--active',
  badgeActive: 'Tab__badge--active'
};
const Tab = ({
  className,
  title,
  isActive,
  isBlocked,
  badgeCount,
  isBadgeActive,
  previousActiveTab,
  contextActions,
  contextRootElementSelector,
  icon,
  clickArg,
  onClick
}) => {
  const tabRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    // Set initial active state
    if (isActive && previousActiveTab === undefined && tabRef.current) {
      tabRef.current.classList.add(classNames.active);
    }
  }, [isActive, previousActiveTab]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isActive || previousActiveTab === undefined) {
      return;
    }
    const tabEl = tabRef.current;
    const prevTabEl = tabEl.parentElement.children[previousActiveTab];
    if (!prevTabEl) {
      // The number of tabs in the parent component has decreased. It is necessary to add the active tab class name.
      if (isActive && !tabEl.classList.contains(classNames.active)) {
        (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestMutation)(() => {
          tabEl.classList.add(classNames.active);
        });
      }
      return;
    }
    const platformEl = tabEl.querySelector('.platform');
    const prevPlatformEl = prevTabEl.querySelector('.platform');

    // We move and resize the platform, so it repeats the position and size of the previous one
    const shiftLeft = prevPlatformEl.parentElement.offsetLeft - platformEl.parentElement.offsetLeft;
    const scaleFactor = prevPlatformEl.clientWidth / platformEl.clientWidth;
    (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestMutation)(() => {
      prevPlatformEl.classList.remove('animate');
      platformEl.classList.remove('animate');
      platformEl.style.transform = `translate3d(${shiftLeft}px, 0, 0) scale3d(${scaleFactor}, 1, 1)`;
      (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestForcedReflow)(() => {
        (0,_util_forceReflow__WEBPACK_IMPORTED_MODULE_4__["default"])(platformEl);
        return () => {
          platformEl.classList.add('animate');
          platformEl.style.transform = 'none';
          prevTabEl.classList.remove(classNames.active);
          tabEl.classList.add(classNames.active);
        };
      });
    });
  }, [isActive, previousActiveTab]);
  const {
    contextMenuAnchor,
    handleContextMenu,
    handleBeforeContextMenu,
    handleContextMenuClose,
    handleContextMenuHide,
    isContextMenuOpen
  } = (0,_hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_6__["default"])(tabRef, !contextActions);
  const {
    handleClick,
    handleMouseDown
  } = (0,_hooks_useFastClick__WEBPACK_IMPORTED_MODULE_7__.useFastClick)(e => {
    if (contextActions && (e.button === _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.MouseButton.Secondary || !onClick)) {
      handleBeforeContextMenu(e);
    }
    if (e.type === 'mousedown' && e.button !== _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.MouseButton.Main) {
      return;
    }
    onClick?.(clickArg);
  });
  const getTriggerElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__["default"])(() => tabRef.current);
  const getRootElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__["default"])(() => contextRootElementSelector ? tabRef.current.closest(contextRootElementSelector) : document.body);
  const getMenuElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__["default"])(() => document.querySelector('#portals').querySelector('.Tab-context-menu .bubble'));
  const getLayout = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__["default"])(() => ({
    withPortal: true
  }));
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('Tab', onClick && 'Tab--interactive', className),
    onClick: handleClick,
    onMouseDown: handleMouseDown,
    onContextMenu: handleContextMenu,
    ref: tabRef,
    children: [icon, (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("span", {
      className: "Tab_inner",
      children: [typeof title === 'string' ? (0,_common_helpers_renderText__WEBPACK_IMPORTED_MODULE_5__["default"])(title) : title, Boolean(badgeCount) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("span", {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('badge', isBadgeActive && classNames.badgeActive),
        children: badgeCount
      }), isBlocked && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_9__["default"], {
        name: "lock-badge",
        className: "blocked"
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("i", {
        className: "platform"
      })]
    }), contextActions && contextMenuAnchor !== undefined && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_Menu__WEBPACK_IMPORTED_MODULE_10__["default"], {
      isOpen: isContextMenuOpen,
      anchor: contextMenuAnchor,
      getTriggerElement: getTriggerElement,
      getRootElement: getRootElement,
      getMenuElement: getMenuElement,
      getLayout: getLayout,
      className: "Tab-context-menu",
      autoClose: true,
      onClose: handleContextMenuClose,
      onCloseAnimationEnd: handleContextMenuHide,
      withPortal: true,
      children: contextActions.map(action => 'isSeparator' in action ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_MenuSeparator__WEBPACK_IMPORTED_MODULE_12__["default"], {}, action.key || 'separator') : (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_MenuItem__WEBPACK_IMPORTED_MODULE_11__["default"], {
        icon: action.icon,
        destructive: action.destructive,
        disabled: !action.handler,
        onClick: action.handler,
        children: action.title
      }, action.title))
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Tab);

/***/ }),

/***/ "./src/components/ui/TabList.scss":
/*!****************************************!*\
  !*** ./src/components/ui/TabList.scss ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/ui/TabList.tsx":
/*!***************************************!*\
  !*** ./src/components/ui/TabList.tsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_animateHorizontalScroll__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/animateHorizontalScroll */ "./src/util/animateHorizontalScroll.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useHorizontalScroll__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useHorizontalScroll */ "./src/hooks/useHorizontalScroll.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_usePreviousDeprecated__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/usePreviousDeprecated */ "./src/hooks/usePreviousDeprecated.ts");
/* harmony import */ var _Tab__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Tab */ "./src/components/ui/Tab.tsx");
/* harmony import */ var _TabList_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./TabList.scss */ "./src/components/ui/TabList.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");










const TAB_SCROLL_THRESHOLD_PX = 16;
// Should match duration from `--slide-transition` CSS variable
const SCROLL_DURATION = _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.IS_IOS ? 450 : _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.IS_ANDROID ? 400 : 300;
const TabList = ({
  tabs,
  activeTab,
  className,
  tabClassName,
  contextRootElementSelector,
  ref,
  onSwitchTab
}) => {
  let containerRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  if (ref) {
    containerRef = ref;
  }
  const previousActiveTab = (0,_hooks_usePreviousDeprecated__WEBPACK_IMPORTED_MODULE_6__["default"])(activeTab);
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_5__["default"])();
  (0,_hooks_useHorizontalScroll__WEBPACK_IMPORTED_MODULE_4__["default"])(containerRef, undefined, true);

  // Scroll container to place active tab in the center
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const container = containerRef.current;
    const {
      scrollWidth,
      offsetWidth,
      scrollLeft
    } = container;
    if (scrollWidth <= offsetWidth) {
      return;
    }
    const activeTabElement = container.childNodes[activeTab];
    if (!activeTabElement) {
      return;
    }
    const {
      offsetLeft: activeTabOffsetLeft,
      offsetWidth: activeTabOffsetWidth
    } = activeTabElement;
    const newLeft = activeTabOffsetLeft - offsetWidth / 2 + activeTabOffsetWidth / 2;

    // Prevent scrolling by only a couple of pixels, which doesn't look smooth
    if (Math.abs(newLeft - scrollLeft) < TAB_SCROLL_THRESHOLD_PX) {
      return;
    }
    (0,_util_animateHorizontalScroll__WEBPACK_IMPORTED_MODULE_1__["default"])(container, newLeft, SCROLL_DURATION);
  }, [activeTab]);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('TabList', 'no-scrollbar', className),
    ref: containerRef,
    dir: lang.isRtl ? 'rtl' : undefined,
    children: tabs.map((tab, i) => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_Tab__WEBPACK_IMPORTED_MODULE_7__["default"], {
      title: tab.title,
      isActive: i === activeTab,
      isBlocked: tab.isBlocked,
      badgeCount: tab.badgeCount,
      isBadgeActive: tab.isBadgeActive,
      previousActiveTab: previousActiveTab,
      onClick: onSwitchTab,
      clickArg: i,
      contextActions: tab.contextActions,
      contextRootElementSelector: contextRootElementSelector,
      className: tabClassName
    }, tab.id))
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(TabList));

/***/ }),

/***/ "./src/components/ui/TextArea.tsx":
/*!****************************************!*\
  !*** ./src/components/ui/TextArea.tsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_browser_globalEnvironment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/browser/globalEnvironment */ "./src/util/browser/globalEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");







const TextArea = ({
  ref,
  id,
  className,
  value,
  label,
  error,
  success,
  disabled,
  readOnly,
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  maxLengthIndicator,
  tabIndex,
  onChange,
  onInput,
  onKeyPress,
  onKeyDown,
  onBlur,
  onPaste,
  noReplaceNewlines
}) => {
  let textareaRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  if (ref) {
    textareaRef = ref;
  }
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_5__["default"])();
  const labelText = error || success || label;
  const fullClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('input-group', value && 'touched', error ? 'error' : success && 'success', disabled && 'disabled', readOnly && 'disabled', labelText && 'with-label', className);
  const resizeHeight = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_4__["default"])(element => {
    (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestMutation)(() => {
      element.style.height = '0';
      (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestForcedReflow)(() => {
        const newHeight = element.scrollHeight;
        return () => {
          element.style.height = `${newHeight}px`;
        };
      });
    });
  });
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    resizeHeight(textarea);
  }, []);
  const handleChange = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    const target = e.currentTarget;
    if (!noReplaceNewlines) {
      const previousSelectionEnd = target.selectionEnd;
      // TDesktop replaces newlines with spaces as well
      target.value = target.value.replace(/\n/g, ' ');
      target.selectionEnd = previousSelectionEnd;
    }
    resizeHeight(target);
    onChange?.(e);
  }, [noReplaceNewlines, onChange]);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    className: fullClassName,
    dir: lang.isRtl ? 'rtl' : undefined,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("textarea", {
      ref: textareaRef,
      className: "form-control",
      id: id,
      dir: "auto",
      value: value || '',
      tabIndex: tabIndex,
      placeholder: placeholder,
      maxLength: maxLength,
      autoComplete: autoComplete,
      spellCheck: _util_browser_globalEnvironment__WEBPACK_IMPORTED_MODULE_2__.IS_TAURI ? false : undefined,
      inputMode: inputMode,
      disabled: disabled,
      readOnly: readOnly,
      onChange: handleChange,
      onInput: onInput,
      onKeyPress: onKeyPress,
      onKeyDown: onKeyDown,
      onBlur: onBlur,
      onPaste: onPaste,
      "aria-label": labelText
    }), labelText && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
      htmlFor: id,
      children: labelText
    }), maxLengthIndicator && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: "max-length-indicator",
      children: maxLengthIndicator
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(TextArea));

/***/ }),

/***/ "./src/components/ui/TextTimer.tsx":
/*!*****************************************!*\
  !*** ./src/components/ui/TextTimer.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_dates_dateFormat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/dates/dateFormat */ "./src/util/dates/dateFormat.ts");
/* harmony import */ var _util_serverTime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/serverTime */ "./src/util/serverTime.ts");
/* harmony import */ var _hooks_schedulers_useInterval__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/schedulers/useInterval */ "./src/hooks/schedulers/useInterval.ts");
/* harmony import */ var _hooks_useForceUpdate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useForceUpdate */ "./src/hooks/useForceUpdate.ts");
/* harmony import */ var _common_AnimatedCounter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/AnimatedCounter */ "./src/components/common/AnimatedCounter.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");







const UPDATE_FREQUENCY = 500; // Sometimes second gets skipped if using 1000

const TextTimer = ({
  endsAt,
  shouldShowZeroOnEnd,
  onEnd
}) => {
  const forceUpdate = (0,_hooks_useForceUpdate__WEBPACK_IMPORTED_MODULE_4__["default"])();
  const serverTime = (0,_util_serverTime__WEBPACK_IMPORTED_MODULE_2__.getServerTime)();
  const isActive = serverTime < endsAt;
  (0,_hooks_schedulers_useInterval__WEBPACK_IMPORTED_MODULE_3__["default"])(forceUpdate, isActive ? UPDATE_FREQUENCY : undefined);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isActive) {
      onEnd?.();
    }
  }, [isActive, onEnd]);
  if (!isActive && !shouldShowZeroOnEnd) return undefined;
  const timeLeft = Math.max(0, endsAt - serverTime);
  const time = (0,_util_dates_dateFormat__WEBPACK_IMPORTED_MODULE_1__.formatMediaDuration)(timeLeft);
  const timeParts = time.split(':');
  const timeCounter = (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
    style: "font-variant-numeric: tabular-nums;",
    children: timeParts.map((part, index) => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
      children: [index > 0 && ':', (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_common_AnimatedCounter__WEBPACK_IMPORTED_MODULE_5__["default"], {
        text: part
      }, index)]
    }))
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
    children: timeCounter
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TextTimer);

/***/ }),

/***/ "./src/components/ui/Toggle.module.scss":
/*!**********************************************!*\
  !*** ./src/components/ui/Toggle.module.scss ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"Toggle-module__root","widget":"Toggle-module__widget","min":"Toggle-module__min","mid":"Toggle-module__mid","max":"Toggle-module__max","filler":"Toggle-module__filler"});

/***/ }),

/***/ "./src/components/ui/Toggle.tsx":
/*!**************************************!*\
  !*** ./src/components/ui/Toggle.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _Toggle_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Toggle.module.scss */ "./src/components/ui/Toggle.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");




function Toggle({
  value
}) {
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_Toggle_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].root, 'Toggle'),
    "aria-hidden": true,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("i", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_Toggle_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].filler, _Toggle_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"][value])
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("i", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_Toggle_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].widget, _Toggle_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"][value])
    })]
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(Toggle));

/***/ }),

/***/ "./src/components/ui/placeholder/PlaceholderChatInfo.module.scss":
/*!***********************************************************************!*\
  !*** ./src/components/ui/placeholder/PlaceholderChatInfo.module.scss ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"PlaceholderChatInfo-module__root","avatar":"PlaceholderChatInfo-module__avatar","info":"PlaceholderChatInfo-module__info","title":"PlaceholderChatInfo-module__title","subtitle":"PlaceholderChatInfo-module__subtitle","animated":"PlaceholderChatInfo-module__animated","slide":"PlaceholderChatInfo-module__slide"});

/***/ }),

/***/ "./src/components/ui/placeholder/PlaceholderChatInfo.tsx":
/*!***************************************************************!*\
  !*** ./src/components/ui/placeholder/PlaceholderChatInfo.tsx ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _PlaceholderChatInfo_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PlaceholderChatInfo.module.scss */ "./src/components/ui/placeholder/PlaceholderChatInfo.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");




const PlaceholderChatInfo = () => {
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: _PlaceholderChatInfo_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].root,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_PlaceholderChatInfo_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].avatar, _PlaceholderChatInfo_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].animated)
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: _PlaceholderChatInfo_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].info,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_PlaceholderChatInfo_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].title, _PlaceholderChatInfo_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].animated)
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_PlaceholderChatInfo_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].subtitle, _PlaceholderChatInfo_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].animated)
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(PlaceholderChatInfo));

/***/ }),

/***/ "./src/components/ui/placeholder/Skeleton.scss":
/*!*****************************************************!*\
  !*** ./src/components/ui/placeholder/Skeleton.scss ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/ui/placeholder/Skeleton.tsx":
/*!****************************************************!*\
  !*** ./src/components/ui/placeholder/Skeleton.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _Skeleton_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Skeleton.scss */ "./src/components/ui/placeholder/Skeleton.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");





const Skeleton = ({
  variant = 'rectangular',
  animation = 'wave',
  width,
  height,
  forceAspectRatio,
  inline,
  className
}) => {
  const classNames = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('Skeleton', variant, animation, className, inline && 'inline');
  const aspectRatio = width && height ? `aspect-ratio: ${width}/${height}` : undefined;
  const style = (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_2__["default"])(forceAspectRatio && aspectRatio, Boolean(width) && `width: ${width}px`, !forceAspectRatio && Boolean(height) && `height: ${height}px`);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    className: classNames,
    style: style,
    children: inline && '\u00A0'
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(Skeleton));

/***/ })

}]);
//# sourceMappingURL=shared-components.da9b95095c4cd01add98.js.map