import React from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {CardContent} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Chip from "@material-ui/core/Chip";
import CardHeader from "@material-ui/core/CardHeader";
import {AiOutlinePushpin, AiOutlineDelete, AiOutlineTags} from "react-icons/ai";
import moment from 'moment';
import Box from "@material-ui/core/Box";
import {MultiLineTypography, StyledAvatar} from "./slack.styles";
import {deleteATag, pinItem, unpinItem} from "../../../../redux/pin/pin.actions";
import {useLocation} from "react-router-dom";
import {VscPin} from "react-icons/vsc";
import IconModal from "../../iconModal/iconModal";
import UpdateTags from "../../updateTags/updateTags";

const Slack = ({item, pinItem, unpinItem, deleteATag, items}) => {

    const {channel, author, message, timestamp, tags} = item;

    const getInitial = (name) => {
        let parts = name.split(" ");
        // If only firstname or nickname
        if (parts.length === 1) return parts[0][0];
        // discard middle name
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const generateKey = (id, source) => {
        return id + source;
    };

    const localPath = useLocation().pathname;
    const getPinButton = () => {
        if (localPath === "/dashboard" ||
            items.some(element => generateKey(element.id, element.source) === generateKey(item.id, item.source))) {
            return (
                <IconButton aria-label="pin" onClick={handleUnpin}>
                    <VscPin/>
                </IconButton>
            );
        }
        return (
            <IconButton aria-label="pin" onClick={handlePin}>
                <AiOutlinePushpin/>
            </IconButton>
        );
    };

    const handleDelete = (tag) => (e) => {
        deleteATag(item, tag);
    };

    const handlePin = () => {
        pinItem(item);
    };

    const handleUnpin = () => {
        unpinItem(item);
    };

    return (
        <>
            <Grid container justify="space-between" alignItems="center">
                <Grid item>
                    <CardContent>
                        <Typography variant="body1">
                            #{channel} - {moment(timestamp).format('MMMM Do YYYY')}
                        </Typography>
                    </CardContent>
                </Grid>
                <Grid item>
                    <IconButton aria-label="delete">
                        <AiOutlineDelete/>
                    </IconButton>
                    <IconModal icon={<AiOutlineTags/>} content={<UpdateTags item={item}/>}/>
                    {getPinButton()}
                </Grid>
            </Grid>

            <CardHeader
                avatar={
                    <StyledAvatar aria-label="name">
                        {getInitial(author)}
                    </StyledAvatar>
                }
                title={
                    <Box component="span" fontWeight={700}>
                        <Typography component="span" variant="body1" style={{fontWeight: 'inherit'}}>
                            {author}
                        </Typography>
                    </Box>
                }
                subheader={moment(timestamp).format('h:mm:ss A')}
            />

            <CardContent>

                <MultiLineTypography variant="body1">
                    {message}
                </MultiLineTypography>

                {tags && tags.length > 0 && tags.map(tag =>
                    <Chip
                        label={tag}
                        color="primary"
                        onDelete={handleDelete}
                    />
                )}
            </CardContent>
        </>
    );
};

Slack.propTypes = {
    item: PropTypes.object.isRequired,
    pinItem: PropTypes.func.isRequired,
    unpinItem: PropTypes.func.isRequired,
    deleteATag: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    items: state.pin.items
});

const mapDispatchToProps = dispatch => ({
    pinItem: item => dispatch(pinItem(item)),
    unpinItem: item => dispatch(unpinItem(item)),
    deleteATag: (item, tag) => dispatch(deleteATag(item, tag))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Slack);