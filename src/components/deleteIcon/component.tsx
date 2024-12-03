import React from "react";
import "./deleteIcon.css";
import { DeleteIconProps, DeleteIconStates } from "./interface";
import DeletePopup from "../dialogs/deletePopup";
import toast from "react-hot-toast";
import NoteService from "../../utils/service/noteService";
import BookmarkService from "../../utils/service/bookmarkService";
import ConfigService from "../../utils/service/configService";

class DeleteIcon extends React.Component<DeleteIconProps, DeleteIconStates> {
  constructor(props: DeleteIconProps) {
    super(props);
    this.state = {
      deleteIndex: -1,
      isOpenDelete: false,
    };
  }

  handleDelete = () => {
    let deleteFunc =
      this.props.mode === "notes"
        ? this.props.handleFetchNotes
        : this.props.handleFetchBookmarks;
    if (this.props.mode === "tags") {
      ConfigService.deleteListConfig(this.props.tagName, "noteTags");
      this.handleDeleteTagFromNote(this.props.tagName);
      return;
    }
    if (this.props.mode === "bookmarks") {
      BookmarkService.deleteBookmark(this.props.itemKey).then(() => {
        deleteFunc();
        toast.success(this.props.t("Deletion successful"));
      });
      return;
    }
    if (this.props.mode === "notes") {
      NoteService.deleteNote(this.props.itemKey).then(() => {
        deleteFunc();
        toast.success(this.props.t("Deletion successful"));
      });
      return;
    }
  };
  handleDeleteTagFromNote = (tagName: string) => {
    let noteList = this.props.notes.map((item) => {
      return {
        ...item,
        tag: item.tag.filter((subitem) => subitem !== tagName),
      };
    });
    NoteService.updateAllNotes(noteList).then(() => {
      this.props.handleFetchNotes();
    });
  };
  handleDeletePopup = (isOpenDelete: boolean) => {
    this.setState({ isOpenDelete });
    if (!isOpenDelete) {
      this.props.handleChangeTag(this.props.index);
    }
  };
  render() {
    const deletePopupProps = {
      name: this.props.tagName,
      title: "Delete this tag",
      description: "This action will clear and remove this tag",
      handleDeletePopup: this.handleDeletePopup,
      handleDeleteOpearion: this.handleDelete,
    };
    return (
      <>
        {this.state.isOpenDelete && <DeletePopup {...deletePopupProps} />}
        <div
          className="delete-digest-button"
          onClick={() => {
            this.props.mode === "tags"
              ? this.handleDeletePopup(true)
              : this.handleDelete();
          }}
        >
          <span className="icon-close delete-digest-icon"></span>
        </div>
      </>
    );
  }
}

export default DeleteIcon;
