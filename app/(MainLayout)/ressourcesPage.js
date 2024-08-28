import {
  Text,
  SegmentedButtons,
  List,
  FAB,
  PaperProvider,
  Divider,
  TouchableRipple,
  IconButton,
  Button,
  Portal,
  Modal,
} from "react-native-paper";
import TopBarForRessources from "../../components/TopBarForRessources";
import {
  SafeAreaView,
  StatusBar,
  Platform,
  NativeModules,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import {
  createFileIfNotExists,
  deleteFileIfExists,
} from "../../utils/fileFolderFunctions";
import {
  NestableScrollContainer,
  NestableDraggableFlatList,
} from "react-native-draggable-flatlist";
import SwapRessourceIconSelected from "../../assets/icons/flavorIcons/swapRessourceIconSelected";
import { Checkbox, Snackbar } from "react-native-paper";
import {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { useContext } from "react";
import { ProskommaContext } from "../../context/proskommaContext";
import { ColorThemeContext } from "../../context/colorThemeContext";
import ResourcesIcon from "../../assets/icons/flavorIcons/resources";
import SwapRessourceIcon from "../../assets/icons/flavorIcons/swapRessourceIcon";
import AddResourcesIcon from "../../assets/icons/flavorIcons/addResources";
import DraggebleListItemIcon from "../../assets/icons/flavorIcons/draggebleListItemIcon";
import SelectedIcon from "../../assets/icons/flavorIcons/Selectedicon";
import { NavigationContext } from "../../context/navigationContext";
import ArrowAlignTop from "../../assets/icons/flavorIcons/vertical_align_top";
import MinusIcon from "../../assets/icons/flavorIcons/minusIcon";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { documentDirectory, readDirectoryAsync } from "expo-file-system";
import NetInfo from "@react-native-community/netinfo";

import { useRouter } from "expo-router";
import { useMemo } from "react";
export default function RessourcesPage() {
  const router = useRouter();
  const [reaload, setReaload] = useState(false);
  const { pk } = useContext(ProskommaContext);
  const { colors, theme } = useContext(ColorThemeContext);
  const {
    docSetId,
    setDocSetId,
    secondariesDocSetIds,
    setSecondariesDocSetIds,
    setQuestionDocSetId,
    questionDocSetId,
  } = useContext(NavigationContext);

  const [currentDocSetId, setCurrentDocSetId] = useState(docSetId);
  const [data, setData] = useState(createDataArray(pk));
  const [multiSelectRessourcesDocId, setMultiSelectRessourcesDocId] = useState(
    secondariesDocSetIds.map((d) => data.filter((e) => e.id === d)[0])
  );

  const [questionDocSetIdInComponent, setQuestionDocSetIdInComponent] =
    useState(questionDocSetId);
  const multiSelectRessourceDocIdRef = useRef([]);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [typeSelection, setTypeSelection] = useState("Simple");
  const scrollView = useRef(null);
  const refList = useRef(null);
  const { StatusBarManager } = NativeModules;
  const [multiSelecTab, setMultiSelectTab] = useState(0);
  const [isInSwapMod, setIsInSwapMode] = useState(false);
  const [indexFile, setIndexFile] = useState({});
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [visible, setVisible] = useState(false);
  const [indexDownload, setIndexDownload] = useState([]);
  const [isConnected, setIsConnected] = useState(null);
  const [modalSupprimer, setModalSupprimer] = useState(false);
  const [ressourceToDelete, setRessourceToDelete] = useState();

  useEffect(() => {
    if (ressourceToDelete) setModalSupprimer(true);
  }, [ressourceToDelete]);
  useEffect(() => {
    if (!modalSupprimer && ressourceToDelete) {
      setRessourceToDelete();
      setReaload((prev) => !prev);
    }
  }, [modalSupprimer]);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isConnected) {
      fetchBibleIndexFromServer().then((e) => setIndexFile(e));
    } else {
      setIndexFile({});
    }
  }, [isConnected]);

  const onContentSizeChange = (width, height) => {};

  const handleScroll = (event) => {
    const { x, y } = event.nativeEvent.contentOffset;
    setScrollPosition({ x, y });
  };
  const renderItem = useCallback(
    ({ item, drag, isActive }) => (
      <TouchableRipple
        index={item.id}
        key={`${item.id}`}
        style={{
          backgroundColor: isActive
            ? colors.schemes[theme].surfaceVariant
            : colors.schemes[theme].surface,
        }}
        rippleColor={colors.schemes[theme].surfaceVariant}
        onPressOut={() => setScrollEnabled(true)}
        onLongPress={() => {
          setScrollEnabled(false);
          if (drag) drag(); // Ensure drag is called correctly
        }}
      >
        <List.Item
          style={{
            paddingLeft: 16,
            paddingRight: 24,
          }}
          contentStyle={{
            paddingLeft: 16,
            height: 56,
            marginHorizontal: 0,
          }}
          title={() => (
            <Text style={{ color: colors.schemes[theme].onSurface }}>
              {item.tags[0].split(":")[1]}
            </Text>
          )}
          description={() => (
            <Text style={{ color: colors.schemes[theme].onSurfaceVariant }}>
              {item.tags[2].split(":")[1].toUpperCase()},{" "}
              {item.tags[3].split(":")[1]}
            </Text>
          )}
          left={() => (
            <TouchableRipple
              borderless
              style={{
                height: 56,
                width: 56,
                borderRadius: 50,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPressOut={() => setScrollEnabled(true)}
              onPressIn={() => {
                setScrollEnabled(false);
                if (drag) drag();
              }}
            >
              <DraggebleListItemIcon
                color={colors.schemes[theme].onSurfaceVariant}
              />
            </TouchableRipple>
          )}
          right={() => (
            <View
              style={{
                gap: 10,
                marginLeft: 16,
                width: 104,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.schemes[theme].onSurfaceVariant,
                }}
                variant="labelMedium"
              >
                Bible #
                {multiSelectRessourcesDocId.map((e) => e.id).indexOf(item.id) +
                  1}
              </Text>
              {isInSwapMod ? (
                <View
                  style={{
                    height: 48,
                    padding: 4,
                  }}
                >
                  <IconButton
                    size={24}
                    style={{
                      margin: 0,
                      padding: 8,
                    }}
                    onPress={() => {
                      setMultiSelectRessourcesDocId((prev) => {
                        multiSelectRessourceDocIdRef.current = prev;

                        return [
                          ...prev.filter((e) => e.id != item.id),
                          data.filter((e) => e.id === currentDocSetId)[0],
                        ];
                      });
                      setCurrentDocSetId(item.id);
                      setIsInSwapMode(false);
                    }}
                    icon={() => (
                      <SwapRessourceIcon
                        color={colors.schemes[theme].primary}
                      />
                    )}
                  />
                </View>
              ) : (
                <IconButton
                  size={24}
                  style={{}}
                  onPress={() =>
                    setMultiSelectRessourcesDocId((prev) => {
                      multiSelectRessourceDocIdRef.current = prev;

                      return prev.filter((e) => e.id !== item.id);
                    })
                  }
                  icon={() => (
                    <MinusIcon color={colors.schemes[theme].onSurfaceVariant} />
                  )}
                />
              )}
            </View>
          )}
        />
      </TouchableRipple>
    ),
    [multiSelectRessourcesDocId]
  );

  useEffect(() => {
    setData(createDataArray(pk));
  }, [reaload]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.schemes[theme].surface }}
    >
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.schemes[theme].surface}
      />
      <PaperProvider
        theme={{
          colors: {
            ...colors.schemes[theme],
            surfaceDisabled: colors.stateLayers[theme].onSurface.opacity012,
            onSurfaceDisabled:
              colors.stateLayers[theme].onSurfaceVariant.opacity012,
            backdrop: colors.stateLayers[theme].scrim.opacity012,
          },
        }}
      >
        <TopBarForRessources
          functionShow={() => {
            router.back();
            setSecondariesDocSetIds(
              multiSelectRessourcesDocId.map((e) => e.id)
            );
            setQuestionDocSetId(questionDocSetIdInComponent);
            setDocSetId(currentDocSetId);
          }}
          mode={typeSelection}
          isActive={
            multiSelectRessourcesDocId.length > 0 ||
            questionDocSetIdInComponent !== ""
          }
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ScrollView
              onScroll={handleScroll}
              ref={scrollView}
              style={{ zIndex: 1 }}
              scrollEnabled={scrollEnabled}
              onContentSizeChange={onContentSizeChange}
              scrollEventThrottle={15}
            >
              <View
                style={{
                  width: "100%",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <View
                  style={{
                    height: 48,
                    justifyContent: "center",
                  }}
                >
                  <SegmentedButtons
                    style={{ paddingVertical: 4 }}
                    value={typeSelection}
                    labelStyle={{ color: colors.schemes[theme].onSurface }}
                    onValueChange={setTypeSelection}
                    checkedColor={colors.schemes[theme].secondaryContainer}
                    buttons={[
                      {
                        value: "Simple",
                        label: "Simple",
                        icon: () =>
                          typeSelection === "Simple" ? (
                            <SelectedIcon
                              color={colors.schemes[theme].onSurface}
                            />
                          ) : (
                            <ResourcesIcon
                              color={colors.schemes[theme].onSurface}
                            />
                          ),
                      },
                      {
                        value: "Multiple",
                        label: "Multiple",

                        icon: () =>
                          typeSelection === "Multiple" ? (
                            <SelectedIcon
                              color={colors.schemes[theme].onSurface}
                            />
                          ) : (
                            <AddResourcesIcon
                              height={18}
                              color={colors.schemes[theme].onSurface}
                            />
                          ),
                      },
                    ]}
                  />
                </View>
              </View>
              {typeSelection === "Simple" ? (
                <>
                  <List.Item
                    style={{
                      paddingLeft: 16,
                      paddingRight: 24,

                      backgroundColor:
                        colors.stateLayers[theme].primary.opacity012,
                    }}
                    contentStyle={{
                      paddingLeft: 16,
                      height: 56,
                      marginHorizontal: 0,
                    }}
                    title={() => (
                      <Text
                        numberOfLines={1} // Set the number of lines
                        ellipsizeMode="tail" // Set the ellipsize mode
                        variant="bodyLarge"
                        style={{ color: colors.schemes[theme].onSurface }}
                      >
                        {
                          data
                            ?.filter((e) => e.id === currentDocSetId)[0]
                            ?.tags[0]?.split(":")[1]
                        }
                      </Text>
                    )}
                    description={() => (
                      <Text
                        style={{
                          color: colors.schemes[theme].onSurfaceVariant,
                        }}
                        numberOfLines={1} // Set the number of lines
                        ellipsizeMode="tail" // Set the ellipsize mode
                        variant="bodyMedium"
                      >
                        {data
                          ?.filter((e) => e.id === currentDocSetId)[0]
                          ?.tags[2].split(":")[1]
                          .toUpperCase()}
                        ,{" "}
                        {
                          data
                            ?.filter((e) => e.id === currentDocSetId)[0]
                            ?.tags[3].split(":")[1]
                        }
                      </Text>
                    )}
                    left={() => <View style={{ width: 56, height: 56 }}></View>}
                    right={() => (
                      <View
                        style={{
                          gap: 10,
                          marginLeft: 16,
                          alignItems: "center",
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            color: colors.schemes[theme].onSurfaceVariant,
                          }}
                          variant="labelMedium"
                        >
                          Actuelle
                        </Text>
                        <View style={{ width: 44, height: 48 }}></View>
                      </View>
                    )}
                  />
                  <Text
                    style={{
                      padding: 16,
                      paddingLeft: 24,
                      color: colors.schemes[theme].onSurface,
                    }}
                    variant="titleLarge"
                  >
                    Disponible
                  </Text>
                  <View>
                    {data
                      ?.filter(
                        (e) =>
                          e.id !== currentDocSetId &&
                          e.tags.length > 0 &&
                          !e.hasTag
                      )
                      .map((d, id) => (
                        <List.Item
                          key={id}
                          onLongPress={() => {
                            setRessourceToDelete(d.id);
                          }}
                          onPress={() => {
                            router.back();
                            setSecondariesDocSetIds([]);
                            setQuestionDocSetIdInComponent("");
                            setDocSetId(d.id);
                          }}
                          style={{
                            paddingLeft: 16,
                            paddingRight: 24,
                            paddingHorizontal: 8,
                            gap: 16,
                          }}
                          title={() => (
                            <Text
                              numberOfLines={1} // Set the number of lines
                              ellipsizeMode="tail" // Set the ellipsize mode
                              variant="bodyLarge"
                              style={{ color: colors.schemes[theme].onSurface }}
                            >
                              {d["tags"].length > 0
                                ? d["tags"][0].split(":")[1]
                                : ""}
                            </Text>
                          )}
                          description={() => (
                            <Text
                              numberOfLines={1} // Set the number of lines
                              ellipsizeMode="tail" // Set the ellipsize mode
                              variant="bodyMedium"
                              style={{
                                color: colors.schemes[theme].onSurfaceVariant,
                              }}
                            >
                              {d["tags"].length > 0
                                ? d["tags"][2].split(":")[1].toUpperCase()
                                : ""}
                              ,{" "}
                              {d["tags"].length > 0
                                ? d["tags"][3].split(":")[1]
                                : ""}
                            </Text>
                          )}
                          left={() => (
                            <View style={{ width: 56, height: 56 }}></View>
                          )}
                          right={() => (
                            <View style={{ width: 44, height: 48 }}></View>
                          )}
                        />
                      ))}
                  </View>
                  <Text
                    style={{
                      padding: 16,
                      paddingLeft: 24,
                      color: colors.schemes[theme].onSurface,
                    }}
                    variant="titleLarge"
                  >
                    Télécharger
                  </Text>
                  {isConnected && indexFile && indexFile.bibles ? (
                    indexFile.bibles
                      .filter((e) => {
                        let t = data.find((t) => t.id === e.id);
                        if (t) {
                          if (t.selector === e.selectors.revision) {
                            return false;
                          }
                          return true;
                        }
                        return true;
                      })
                      .map((d, id) => (
                        <>
                          <List.Item
                            key={id}
                            onPress={() => {
                              dlAndLoadFromServer(
                                d.succinctUrl,
                                pk,
                                setReaload,
                                indexDownload,
                                setIndexDownload,
                                id
                              );
                            }}
                            style={{
                              paddingLeft: 16,
                              paddingRight: 24,
                              paddingHorizontal: 8,
                              gap: 16,
                            }}
                            title={() => (
                              <Text
                                numberOfLines={1} // Set the number of lines
                                ellipsizeMode="tail" // Set the ellipsize mode
                                variant="bodyLarge"
                                style={{
                                  color: colors.schemes[theme].onSurface,
                                }}
                              >
                                {d.title}
                              </Text>
                            )}
                            description={() => (
                              <Text
                                numberOfLines={1} // Set the number of lines
                                ellipsizeMode="tail" // Set the ellipsize mode
                                variant="bodyMedium"
                                style={{
                                  color: colors.schemes[theme].onSurfaceVariant,
                                }}
                              >
                                {d.languageCode.toUpperCase()}, {d.owner}
                              </Text>
                            )}
                            left={() => (
                              <View style={{ width: 56, height: 56 }}></View>
                            )}
                            right={() => (
                              <View style={{ width: 44, height: 48 }}></View>
                            )}
                          />
                          {indexDownload.includes(id) &&
                          data.filter((e) => e.id === indexDownload) ? (
                            <View
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Text>En train de telecharger</Text>
                            </View>
                          ) : (
                            <Text></Text>
                          )}
                        </>
                      ))
                  ) : (
                    <Text
                      style={{
                        alignItems: "center",
                        alignSelf: "stretch",
                        paddingVertical: 16,
                        flexWrap: "wrap",
                        marginHorizontal: "auto",
                      }}
                      variant="labelLarge"
                    >
                      Besoin d'une connexion internet
                    </Text>
                  )}
                </>
              ) : (
                <View>
                  <List.Item
                    style={{
                      paddingLeft: 16,
                      paddingRight: 24,

                      backgroundColor:
                        colors.stateLayers[theme].primary.opacity012,
                    }}
                    contentStyle={{
                      paddingLeft: 16,
                      height: 56,
                      marginHorizontal: 0,
                    }}
                    title={() => (
                      <Text
                        numberOfLines={1} // Set the number of lines
                        ellipsizeMode="tail" // Set the ellipsize mode
                        variant="bodyLarge"
                        style={{ color: colors.schemes[theme].onSurface }}
                      >
                        {
                          data
                            ?.filter((e) => e.id === currentDocSetId)[0]
                            ?.tags[0]?.split(":")[1]
                        }
                      </Text>
                    )}
                    description={() => (
                      <Text
                        style={{
                          color: colors.schemes[theme].onSurfaceVariant,
                        }}
                        numberOfLines={1} // Set the number of lines
                        ellipsizeMode="tail" // Set the ellipsize mode
                        variant="bodyMedium"
                      >
                        {data
                          ?.filter((e) => e.id === currentDocSetId)[0]
                          ?.tags[2].split(":")[1]
                          .toUpperCase()}
                        ,{" "}
                        {
                          data
                            ?.filter((e) => e.id === currentDocSetId)[0]
                            ?.tags[3].split(":")[1]
                        }
                      </Text>
                    )}
                    left={() => <View style={{ width: 56, height: 56 }}></View>}
                    right={() => (
                      <View
                        style={{
                          gap: 10,
                          marginLeft: 16,
                          alignItems: "center",
                          display: "flex",
                          flexDirection: "row",
                          width: 104,
                        }}
                      >
                        <Text
                          style={{
                            color: colors.schemes[theme].onSurfaceVariant,
                          }}
                          variant="labelMedium"
                        >
                          Actuelle
                        </Text>
                        {multiSelectRessourcesDocId.length != 0 ? (
                          <IconButton
                            size={24}
                            style={{}}
                            onPress={() => setIsInSwapMode((prev) => !prev)}
                            icon={() =>
                              isInSwapMod ? (
                                <SwapRessourceIconSelected
                                  color={colors.schemes[theme].primary}
                                />
                              ) : (
                                <SwapRessourceIcon
                                  color={colors.schemes[theme].primary}
                                />
                              )
                            }
                          />
                        ) : (
                          <View style={{ width: 44, height: 48 }}></View>
                        )}
                      </View>
                    )}
                  />
                  {questionDocSetIdInComponent !== "" ? (
                    <List.Item
                      style={{
                        paddingLeft: 16,
                        paddingRight: 24,
                      }}
                      contentStyle={{
                        paddingLeft: 16,
                        height: 56,
                        marginHorizontal: 0,
                      }}
                      title={() => (
                        <Text
                          numberOfLines={1} // Set the number of lines
                          ellipsizeMode="tail" // Set the ellipsize mode
                          variant="bodyLarge"
                          style={{ color: colors.schemes[theme].onSurface }}
                        >
                          {
                            data
                              ?.filter(
                                (e) => e.id === questionDocSetIdInComponent
                              )[0]
                              ?.tags[0]?.split(":")[1]
                          }
                        </Text>
                      )}
                      description={() => (
                        <Text
                          style={{
                            color: colors.schemes[theme].onSurfaceVariant,
                          }}
                          numberOfLines={1} // Set the number of lines
                          ellipsizeMode="tail" // Set the ellipsize mode
                          variant="bodyMedium"
                        >
                          {data
                            ?.filter(
                              (e) => e.id === questionDocSetIdInComponent
                            )[0]
                            ?.tags[2].split(":")[1]
                            .toUpperCase()}
                          ,{" "}
                          {
                            data
                              ?.filter(
                                (e) => e.id === questionDocSetIdInComponent
                              )[0]
                              ?.tags[3].split(":")[1]
                          }
                        </Text>
                      )}
                      left={() => (
                        <View style={{ width: 56, height: 56 }}></View>
                      )}
                      right={() => (
                        <View
                          style={{
                            gap: 10,
                            marginLeft: 16,
                            alignItems: "center",
                            display: "flex",
                            flexDirection: "row",
                            width: 117,
                          }}
                        >
                          <Text
                            style={{
                              color: colors.schemes[theme].onSurfaceVariant,
                            }}
                            variant="labelMedium"
                          >
                            Questions
                          </Text>
                          <IconButton
                            size={24}
                            style={{}}
                            onPress={() => setQuestionDocSetIdInComponent("")}
                            icon={() => (
                              <MinusIcon
                                color={colors.schemes[theme].onSurfaceVariant}
                              />
                            )}
                          />
                        </View>
                      )}
                    />
                  ) : (
                    <></>
                  )}
                  <NestableScrollContainer>
                    <NestableDraggableFlatList
                      ref={refList}
                      data={multiSelectRessourcesDocId}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.id}
                      onDragEnd={({ data }) => {
                        setMultiSelectRessourcesDocId((prev) => {
                          multiSelectRessourceDocIdRef.current = prev;

                          return data;
                        });
                      }}
                      dragScale={0.5}
                    />
                  </NestableScrollContainer>

                  <View
                    style={{
                      height: 72,
                      paddingVertical: 16,
                      paddingLeft: 76,
                      paddingRight: 68,
                      width: "100%",
                      alignItems: "center",
                      alignSelf: "stretch",
                    }}
                  >
                    
                    
                      <Button
                        onPress={() => {
                          setMultiSelectRessourcesDocId((prev) => {
                            multiSelectRessourceDocIdRef.current = prev;

                            return [];
                          });
                          setVisible(true);
                        }}
                        
                          style={{
                            
                          backgroundColor: 
                          (multiSelectRessourcesDocId.length === 0 &&
                            questionDocSetIdInComponent.length === 0 )?
                            colors.schemes[theme].surfaceVariant:
                          colors.schemes[theme].error,
                        }}
                        disabled={(multiSelectRessourcesDocId.length === 0 &&
                                   questionDocSetIdInComponent.length === 0 )}
                        icon={() => (
                          <MinusIcon
                            color={
                              (multiSelectRessourcesDocId.length === 0 &&
                                questionDocSetIdInComponent.length === 0 )?
                                colors.schemes[theme].onSurfaceVariant:colors.schemes[theme].onError}
                            size={18}
                          />
                        )}
                        contentStyle={{
                          height: 40,
                          alignSelf: "stretch",
                          paddingRight: 8,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center", // Center content horizontally
                        }}
                      >
                        <Text
                          variant="labelLarge"
                          style={{ color: (multiSelectRessourcesDocId.length === 0 &&
                            questionDocSetIdInComponent.length === 0 )?
                            colors.schemes[theme].onSurfaceVariant:
                            colors.schemes[theme].onError }}
                        >
                          Retirer tout
                        </Text>
                      </Button>
                    
                  </View>
                  <Text
                    style={{
                      padding: 16,
                      paddingLeft: 24,
                      color: colors.schemes[theme].onSurface,
                    }}
                    variant="titleLarge"
                  >
                    Disponible
                  </Text>
                  <View>
                    <View
                      style={{
                        height: 48,
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <TouchableRipple
                        rippleColor={
                          colors.stateLayers[theme].primary.opacity012
                        }
                        onPress={() => setMultiSelectTab(0)}
                        style={{
                          width: "50%",
                          height: 48,
                          justifyContent: "flex-end",
                          alignItems: "center",
                          paddingHorizontal: 16,
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              marginBottom: 14,
                              color:
                                multiSelecTab === 0
                                  ? colors.schemes[theme].primary
                                  : colors.schemes[theme].onSurface,
                            }}
                            variant="titleSmall"
                          >
                            Bibles
                          </Text>
                          <View
                            style={{
                              borderTopLeftRadius: 35,
                              borderTopRightRadius: 35,
                              height: 2,
                              backgroundColor:
                                multiSelecTab === 0
                                  ? colors.schemes[theme].primary
                                  : colors.schemes[theme].surface,
                            }}
                          />
                        </View>
                      </TouchableRipple>
                      <TouchableRipple
                        rippleColor={
                          colors.stateLayers[theme].primary.opacity012
                        }
                        onPress={() => setMultiSelectTab(1)}
                        style={{
                          width: "50%",
                          height: 48,
                          justifyContent: "flex-end",
                          alignItems: "center",
                          paddingHorizontal: 16,
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              marginBottom: 14,
                              color:
                                multiSelecTab === 1
                                  ? colors.schemes[theme].primary
                                  : colors.schemes[theme].onSurface,
                            }}
                            variant="titleSmall"
                          >
                            Questions
                          </Text>
                          <View
                            style={{
                              borderTopLeftRadius: 35,
                              borderTopRightRadius: 35,
                              height: 2,
                              backgroundColor:
                                multiSelecTab === 1
                                  ? colors.schemes[theme].primary
                                  : colors.schemes[theme].surface,
                            }}
                          />
                        </View>
                      </TouchableRipple>
                    </View>
                    <Divider />

                    {multiSelecTab === 0 ? (
                      <>
                        {data
                          .filter(
                            (e) =>
                              e.id !== currentDocSetId &&
                              e.tags.length > 0 &&
                              !e.hasTag
                          )
                          .map((d, id) => (
                            <List.Item
                            
                              key={id}
                              onLongPress={() => setRessourceToDelete(d.id)}
                              onPress={() => {
                                if (isInSwapMod) {
                                  setCurrentDocSetId(d.id);
                                  setIsInSwapMode(false);
                                } else {
                                  setMultiSelectRessourcesDocId((prev) => {
                                    multiSelectRessourceDocIdRef.current = prev;

                                    if (prev.some((e) => e.id === d.id)) {
                                      setTimeout(() => {
                                        scrollView.current.scrollTo({
                                          x: scrollPosition.x,
                                          y: scrollPosition.y - 84,
                                          animated: false,
                                        });
                                      }, 1);
                                      return prev.filter((e) => e.id !== d.id);
                                    } else {
                                      setTimeout(() => {
                                        scrollView.current.scrollTo({
                                          x: scrollPosition.x,
                                          y: scrollPosition.y + 84,
                                          animated: false,
                                        });
                                      }, 1);

                                      return [...prev, d];
                                    }
                                  });
                                }
                              }}
                              style={{
                                paddingLeft: 16,
                                paddingRight: 24,
                                paddingHorizontal: 8,
                                gap: 16,

                                backgroundColor:
                                  multiSelectRessourcesDocId.filter(
                                    (e) => e.id === d.id
                                  ).length !== 0
                                    ? colors.stateLayers[theme].onSurfaceVariant
                                        .opacity012
                                    : colors.schemes[theme].surface,

                              }}
                              title={() => (
                                <Text
                                  numberOfLines={1} // Set the number of lines
                                  ellipsizeMode="tail" // Set the ellipsize mode
                                  variant="bodyLarge"
                                  style={{
                                    color: colors.schemes[theme].onSurface,
                                  }}
                                >
                                  {d["tags"].length > 0
                                    ? d["tags"][0].split(":")[1]
                                    : ""}
                                </Text>
                              )}
                              description={() => (
                                <Text
                                  numberOfLines={1} // Set the number of lines
                                  ellipsizeMode="tail" // Set the ellipsize mode
                                  variant="bodyMedium"
                                  style={{
                                    color:
                                      colors.schemes[theme].onSurfaceVariant,
                                  }}
                                >
                                  {d["tags"].length > 0
                                    ? d["tags"][2].split(":")[1].toUpperCase()
                                    : ""}
                                  ,{" "}
                                  {d["tags"].length > 0
                                    ? d["tags"][3].split(":")[1]
                                    : ""}
                                </Text>
                              )}
                              left={() => (
                                <View style={{ width: 56, height: 56 }}></View>
                              )}
                              right={() => (
                                <View
                                  style={{
                                    height: 48,
                                    padding: 4,
                                  }}
                                >
                                  {isInSwapMod ? (
                                    <IconButton
                                      size={24}
                                      style={{
                                        margin: 0,
                                        padding: 8,
                                      }}
                                      onPress={() => {
                                        if (
                                          multiSelectRessourcesDocId.filter(
                                            (e) => e.id === d.id
                                          ).length > 0
                                        ) {
                                          setMultiSelectRessourcesDocId(
                                            (prev) => {
                                              multiSelectRessourceDocIdRef.current =
                                                prev;

                                              return [
                                                ...prev.filter(
                                                  (e) => e.id != d.id
                                                ),
                                                data.filter(
                                                  (e) =>
                                                    e.id === currentDocSetId
                                                )[0],
                                              ];
                                            }
                                          );
                                        }
                                        setCurrentDocSetId(d.id);
                                        setIsInSwapMode(false);
                                      }}
                                      icon={() => (
                                        <SwapRessourceIcon
                                          color={colors.schemes[theme].primary}
                                        />
                                      )}
                                    />
                                  ) : (
                                    <View
                                      style={{
                                        padding: 2,
                                      }}
                                    >
                                      <Checkbox
                                        status={
                                          multiSelectRessourcesDocId.filter(
                                            (e) => e.id === d.id
                                          ).length !== 0
                                            ? "checked"
                                            : "unchecked"
                                        }
                                      />
                                    </View>
                                  )}
                                </View>
                              )}
                            />
                          ))}
                        <>
                          <Text
                            style={{
                              padding: 16,
                              paddingLeft: 24,
                              color: colors.schemes[theme].onSurface,
                            }}
                            variant="titleLarge"
                          >
                            Télécharger
                          </Text>
                          {isConnected && indexFile && indexFile.bibles ? (
                            indexFile.bibles
                              .filter((e) => {
                                let t = data.find((t) => t.id === e.id);
                                if (t) {
                                  if (t.selector === e.selectors.revision) {
                                    return false;
                                  }
                                  return true;
                                }
                                return true;
                              })
                              .map((d, id) => (
                                <>
                                  <List.Item
                                    key={id}
                                    onPress={() => {
                                      dlAndLoadFromServer(
                                        d.succinctUrl,
                                        pk,
                                        setReaload,
                                        indexDownload,
                                        setIndexDownload,
                                        id
                                      );
                                    }}
                                    style={{
                                      paddingLeft: 16,
                                      paddingRight: 24,
                                      paddingHorizontal: 8,
                                      gap: 16,
                                    }}
                                    title={() => (
                                      <Text
                                        numberOfLines={1} // Set the number of lines
                                        ellipsizeMode="tail" // Set the ellipsize mode
                                        variant="bodyLarge"
                                        style={{
                                          color:
                                            colors.schemes[theme].onSurface,
                                        }}
                                      >
                                        {d.title}
                                      </Text>
                                    )}
                                    description={() => (
                                      <Text
                                        numberOfLines={1} // Set the number of lines
                                        ellipsizeMode="tail" // Set the ellipsize mode
                                        variant="bodyMedium"
                                        style={{
                                          color:
                                            colors.schemes[theme]
                                              .onSurfaceVariant,
                                        }}
                                      >
                                        {d.languageCode.toUpperCase()},{" "}
                                        {d.owner}
                                      </Text>
                                    )}
                                    left={() => (
                                      <View
                                        style={{ width: 56, height: 56 }}
                                      ></View>
                                    )}
                                    right={() => (
                                      <View
                                        style={{ width: 44, height: 48 }}
                                      ></View>
                                    )}
                                  />
                                  {indexDownload.includes(id) &&
                                  data.filter((e) => e.id === indexDownload) ? (
                                    <View
                                      style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Text>En train de telecharger</Text>
                                    </View>
                                  ) : (
                                    <Text></Text>
                                  )}
                                </>
                              ))
                          ) : (
                            <Text
                              style={{
                                alignItems: "center",
                                alignSelf: "stretch",
                                paddingVertical: 16,
                                flexWrap: "wrap",
                                marginHorizontal: "auto",
                              }}
                              variant="labelLarge"
                            >
                              Besoin d'une connexion internet
                            </Text>
                          )}
                        </>
                      </>
                    ) : (
                      <>
                        {data
                          .filter(
                            (e) =>
                              e.id !== currentDocSetId &&
                              e.tags.length > 0 &&
                              e.hasTag
                          )
                          .map((d, id) => (
                            <List.Item
                              key={id}
                              onLongPress={() => setRessourceToDelete(d.id)}
                              onPress={() => {
                                if (d.id === questionDocSetIdInComponent) {
                                  setQuestionDocSetIdInComponent("");
                                } else {
                                  setQuestionDocSetIdInComponent(d.id);
                                }
                              }}
                              style={{
                                paddingLeft: 16,
                                paddingRight: 24,
                                backgroundColor: "red",
                                paddingHorizontal: 8,
                                gap: 16,
                                backgroundColor:
                                  questionDocSetIdInComponent === d.id
                                    ? colors.stateLayers[theme].onSurfaceVariant
                                        .opacity012
                                    : colors.schemes[theme].surface,
                              }}
                              title={() => (
                                <Text
                                  numberOfLines={1} // Set the number of lines
                                  ellipsizeMode="tail" // Set the ellipsize mode
                                  variant="bodyLarge"
                                  style={{
                                    color: colors.schemes[theme].onSurface,
                                  }}
                                >
                                  {d["tags"].length > 0
                                    ? d["tags"][0].split(":")[1]
                                    : ""}
                                </Text>
                              )}
                              description={() => (
                                <Text
                                  numberOfLines={1} // Set the number of lines
                                  ellipsizeMode="tail" // Set the ellipsize mode
                                  variant="bodyMedium"
                                  style={{
                                    color:
                                      colors.schemes[theme].onSurfaceVariant,
                                  }}
                                >
                                  {d["tags"].length > 0
                                    ? d["tags"][2].split(":")[1].toUpperCase()
                                    : ""}
                                  ,{" "}
                                  {d["tags"].length > 0
                                    ? d["tags"][3].split(":")[1]
                                    : ""}
                                </Text>
                              )}
                              left={() => (
                                <View style={{ width: 56, height: 56 }}></View>
                              )}
                              right={() => (
                                <View
                                  style={{
                                    height: 48,
                                    padding: 4,
                                  }}
                                >
                                  {isInSwapMod ? (
                                    <IconButton
                                      size={24}
                                      style={{
                                        margin: 0,
                                        padding: 8,
                                      }}
                                      onPress={() => {
                                        if (
                                          multiSelectRessourcesDocId.filter(
                                            (e) => e.id === d.id
                                          ).length > 0
                                        ) {
                                          setMultiSelectRessourcesDocId(
                                            (prev) => {
                                              multiSelectRessourceDocIdRef.current =
                                                prev;

                                              return [
                                                ...prev.filter(
                                                  (e) => e.id != d.id
                                                ),
                                                data.filter(
                                                  (e) =>
                                                    e.id === currentDocSetId
                                                )[0],
                                              ];
                                            }
                                          );
                                        }
                                        setCurrentDocSetId(d.id);
                                        setIsInSwapMode(false);
                                      }}
                                      icon={() => (
                                        <SwapRessourceIcon
                                          color={colors.schemes[theme].primary}
                                        />
                                      )}
                                    />
                                  ) : (
                                    <View
                                      style={{
                                        padding: 2,
                                      }}
                                    >
                                      <Checkbox
                                        status={
                                          questionDocSetIdInComponent === d.id
                                            ? "checked"
                                            : "unchecked"
                                        }
                                      />
                                    </View>
                                  )}
                                </View>
                              )}
                            />
                          ))}
                        <Text
                          style={{
                            padding: 16,
                            paddingLeft: 24,
                            color: colors.schemes[theme].onSurface,
                          }}
                          variant="titleLarge"
                        >
                          Télécharger
                        </Text>
                        {isConnected && indexFile && indexFile.bibles ? (
                          indexFile.questions
                            .filter((e) => {
                              let t = data.find((t) => t.id === e.id);
                              if (t) {
                                if (t.selector === e.selectors.revision) {
                                  return false;
                                }
                                return true;
                              }
                              return true;
                            })
                            .map((d, id) => (
                              <>
                                <List.Item
                                  key={id}
                                  onPress={() =>
                                    dlAndLoadFromServer(
                                      d.succinctUrl,
                                      pk,
                                      setReaload,
                                      indexDownload,
                                      setIndexDownload,
                                      id
                                    )
                                  }
                                  style={{
                                    paddingLeft: 16,
                                    paddingRight: 24,
                                    paddingHorizontal: 8,
                                    gap: 16,
                                  }}
                                  title={() => (
                                    <Text
                                      numberOfLines={1} // Set the number of lines
                                      ellipsizeMode="tail" // Set the ellipsize mode
                                      variant="bodyLarge"
                                      style={{
                                        color: colors.schemes[theme].onSurface,
                                      }}
                                    >
                                      {d.title}
                                    </Text>
                                  )}
                                  description={() => (
                                    <Text
                                      numberOfLines={1} // Set the number of lines
                                      ellipsizeMode="tail" // Set the ellipsize mode
                                      variant="bodyMedium"
                                      style={{
                                        color:
                                          colors.schemes[theme]
                                            .onSurfaceVariant,
                                      }}
                                    >
                                      {d.languageCode.toUpperCase()}, {d.owner}
                                    </Text>
                                  )}
                                  left={() => (
                                    <View
                                      style={{ width: 56, height: 56 }}
                                    ></View>
                                  )}
                                  right={() => (
                                    <View
                                      style={{ width: 44, height: 48 }}
                                    ></View>
                                  )}
                                />
                                {indexDownload.includes(id) &&
                                data.filter((e) => e.id === indexDownload) ? (
                                  <View
                                    style={{
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Text>En train de telecharger</Text>
                                  </View>
                                ) : (
                                  <Text></Text>
                                )}
                              </>
                            ))
                        ) : (
                          <Text
                            style={{
                              alignItems: "center",
                              alignSelf: "stretch",
                              paddingVertical: 16,
                              flexWrap: "wrap",
                              marginHorizontal: "auto",
                            }}
                            variant="labelLarge"
                          >
                            Besoin d'une connexion internet
                          </Text>
                        )}
                      </>
                    )}
                  </View>
                </View>
              )}
              
            </ScrollView>
            <Portal>
           
              <Modal
                visible={modalSupprimer}
                onDismiss={() => setModalSupprimer(false)}
              >
                <View
                  style={{
                    marginHorizontal: 24,
                    backgroundColor: colors.schemes[theme].surfaceContainerHigh,
                    padding: 24,
                    borderRadius: 28,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      gap: 16,
                      alignSelf: "stretch",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text variant="headlineSmall">Supprimer ressource ?</Text>
                    <Text
                      style={{ color: colors.schemes[theme].onSurfaceVariant }}
                      variant="bodyMedium"
                    >
                      La ressource sera supprimée du téléphone, mais pourra être
                      téléchargée à nouveau.
                    </Text>
                  </View>
                  <View
                    style={{
                      gap: 8,
                      paddingVertical: 24,
                      paddingLeft: 8,
                      justifyContent: "flex-end",
                      alignSelf: "stretch",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <TouchableRipple
                      onPress={() => {
                        setModalSupprimer(false);
                      }}
                    >
                      <Text
                        variant="labelLarge"
                        style={{
                          color: colors.schemes[theme].primary,
                          paddingHorizontal: 12,
                          paddingVertical: 10,
                        }}
                      >
                        Annuler
                      </Text>
                    </TouchableRipple>
                    <TouchableRipple
                      onPress={async () => {
                        deleteFileIfExists(
                          `succinct/${ressourceToDelete}.json`
                        );
                        query = `mutation { deleteDocSet(docSetId: "${ressourceToDelete}") }`;
                        result = await pk.gqlQuery(query);
                        setModalSupprimer(false);
                      }}
                    >
                      <Text
                        variant="labelLarge"
                        style={{
                          color: colors.schemes[theme].primary,
                          paddingHorizontal: 12,
                          paddingVertical: 10,
                        }}
                      >
                        Supprimer
                      </Text>
                    </TouchableRipple>
                  </View>
                </View>
                <></>
                
              </Modal>
              <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}
                action={{
                  label: "Annuler",
                  onPress: () => {
                    setMultiSelectRessourcesDocId(
                      multiSelectRessourceDocIdRef.current
                    );
                    setVisible(false);
                  },
                }}
              >
                Sélection retirée
              </Snackbar>
              <FAB
                size="small"
                icon="arrow-collapse-up"
                style={{
                  position: "absolute",
                  right: 0,
                  margin: 16,
                  bottom: 0,
                  opacity: scrollPosition.y > 0 ? 1 : 0, // Use opacity to control visibility
                }}
                onPress={() => scrollView.current.scrollTo({ x: 0, y: 0 })}
              />
            </Portal>
          </GestureHandlerRootView>
        </TopBarForRessources>
      </PaperProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    display: "flex",
  },
  fab: {
    position: "absolute",
    right: 0,
    margin: 16,
    bottom: 0,
  },
  segmentedButtonContainer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    paddingHorizontal: 16,
    paddingTop: 16,
    fontSize: 24,
  },
  card: {
    paddingLeft: 16,
    paddingRight: 24,
    paddingHorizontal: 8,
    gap: 16,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 16,
  },
});
function createDataArray(pk) {
  const response = pk.gqlQuerySync(`
      {
        docSets {
            hasTag(tagName: "resourcetype:questions")
                selector(id: "revision")

          tags
          id
        }
      }
    `);
  return response.data.docSets;
}

async function fetchBibleIndexFromServer() {
  try {
    const response = await fetch(
      `https://sunteleo-resources.xenizo.fr/index.json`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Convert response to JSON
    return data[0]; // Return the JSON data
  } catch (error) {
    console.error("Error fetching data:", error); // Handle errors
  }
}

async function dlAndLoadFromServer(
  url,
  pk,
  setReaload,
  indexDownload,
  setIndexDownload,
  id
) {
  try {
    if (!indexDownload.includes(id)) {
      setIndexDownload((prev) => [...prev, id]);
      const response = await fetch(
        `https://sunteleo-resources.xenizo.fr/${url}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Convert response to JSON
      await createFileIfNotExists(`succinct/${url}`, data);
      pk.loadSuccinctDocSet(data);
      setReaload((prev) => !prev);

      setIndexDownload((prev) => {
        return prev.splice(prev.indexOf(id), 0);
      });

      return true; // Return the JSON data
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error fetching data:", error); // Handle errors
    return false;
  }
}
